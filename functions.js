///// Requires /////
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();
const firestore = admin.firestore;

// Secret Key from Stripe Dashboard
const stripe = require('stripe')(
	'sk_test_51HfovtLpuIUMARr9ITSvmnDid8zJ1V0sKPAbj5kE0qZ7ueA9NkYowHHlkGa5AKA1Sa35iHevylhNi1DjWe0NNdRo00UzF6OLGs'
);

////// nextServer //////////

const { default: next } = require('next');

const isDev = process.env.NODE_ENV !== 'production';

const server = next({
	dev: isDev,
	//location of .next generated after running -> yarn build
	conf: { distDir: '.next' },
});

const nextjsHandle = server.getRequestHandler();
exports.nextServer = functions.https.onRequest((req, res) => {
	return server.prepare().then(() => nextjsHandle(req, res));
});

////// cancelOrder //////////

// +++ Creates the order's info into firestore ---
exports.cancelOrder = functions.https.onCall(async (data, context) => {
	const refOrders = await db.collection('orders');
	let result;

	refOrders
		.doc(data.orderId)
		.update({
			'dates.cancelledOn': firestore.Timestamp.now(),
		})
		.then(() => (result.success = true))
		.catch((error) => ((result.error = error.message), (result.success = false)));
	return result;
});
// --- Creates the order's info into firestore +++

////// createUserDocument //////////

exports.createUserDocument = functions.auth.user().onCreate(async (user) => {
	// +++ User object to insert to the new document ---
	console.log(`User: ${JSON.stringify(user)}`);
	const userObj = {
		addresses: [],
		favorites: [],
		shoppingLists: [],
	};
	if (user.uid) userObj.uid = user.uid;
	if (user.email) userObj.email = user.email;
	if (user.displayName) userObj.displayName = user.displayName;
	if (user.phoneNumber) userObj.phoneNumber = user.phoneNumber;

	// --- User object to insert to the new document +++

	// +++ Creates the user document on firestore ---
	db.collection('users').doc(user.uid).set(userObj);
	// --- Creates the user document on firestore +++
});

////// retrieveStripeSession //////////

exports.retrieveStripeSession = functions.https.onCall(async (data, context) => {
	console.log(`DATA: ${JSON.stringify(data)}`);
	return await stripe.checkout.sessions.retrieve(data.sessionId);
});

////////// createOrderAndSession  //////////

const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet('0123456789', 6);

// +++ Validate if cartDetails' info hasn't been changed ---
const validateCartItems = (inventorySrc, cartDetails) => {
	const validatedItems = [];
	for (const sku in cartDetails) {
		const product = cartDetails[sku];
		const inventoryItem = inventorySrc.find((currentProduct) => currentProduct.sku === sku);
		if (!inventoryItem) throw new Error(`Product ${sku} not found!`);
		const item = {
			name: inventoryItem.name,
			amount: inventoryItem.price,
			currency: inventoryItem.currency,
			quantity: product.quantity,
		};
		if (inventoryItem.description) item.description = inventoryItem.description;
		if (inventoryItem.image) item.images = [inventoryItem.image];
		validatedItems.push(item);
	}

	return validatedItems;
};
// --- Validate of cartDetails' info hasn't been changed +++

// +++ Creates a new order id with the YYYY + 6 random digit numbers ---
var newId;
// --- Creates a new order id +++

// +++ Creates the order's info into firestore ---
const createOrder = async (data, sessionId) => {
	const refOrders = await db.collection('orders');

	refOrders.doc(newId).set({
		sessionId,
		owner: data.clientId,
		dates: {
			cancelledOn: null,
			receivedOn: firestore.Timestamp.now(),
			preparedOn: null,
			outForDeliveryOn: null,
			deliveredOn: null,
		},
		status: 'processing',
		step: 0,
		deliveryAddress: {
			addressNickname: data.deliveryAddress.addressNickname,
			streetAddress: data.deliveryAddress.streetAddress,
			postalCode: data.deliveryAddress.postalCode,
			city: data.deliveryAddress.city,
			state: data.deliveryAddress.stateProvince,
			country: data.deliveryAddress.country,
		},
		items: data.productsData.map((product) => {
			return {
				name: product.name,
				price: product.price,
				priceBase: product.priceBase,
				priceCurrent: product.priceCurrent,
				sku: product.sku,
				imageUrl: product.images[0].url,
				quantity: data.cartDetails[product.sku].quantity,
			};
		}),
	});
};
// --- Creates the order's info into firestore +++

// +++ The function that get data from front-end and create a payment session ---
exports.createOrderAndSession = functions.https.onCall(async (data, context) => {
	// +++ Collects inventory from firestore and compares with cartDetails ---
	newId = `${new Date().getFullYear()}${nanoid()}`;
	const productsRef = db.collection('products');
	const snapshot = await productsRef.get();
	const inventory = [];
	snapshot.forEach((doc) => {
		inventory.push(doc.data());
	});

	const cartDetails = data.cartDetails;

	const line_items = validateCartItems(inventory, cartDetails);
	// --- Collect inventory from firestore and compares with cartDetails +++

	// +++ Create stripe's checkout session ---
	const sessionId = await stripe.checkout.sessions
		.create({
			success_url: 'https://nextjs-ecommerce.web.app/cart/result?session_id={CHECKOUT_SESSION_ID}',
			cancel_url: 'https://nextjs-ecommerce.web.app/cart/result?session_id={CHECKOUT_SESSION_ID}',
			mode: 'payment',
			payment_method_types: ['card'],
			line_items,
			customer_email: data.customerEmail,
		})
		.then((session) => {
			// Here we can do something with the session id, e.g. add it to the order data in firebase database
			// Sending the session id to front-end
			createOrder(data, session.id);
			return session.id;
		})
		.catch((error) => {
			console.log(`Create Session Error: ${error}`);
			return error;
		});

	return { sessionId, orderId: newId };
	// --- Create stripe's checkout session +++
});
// --- The function that get data from front-end and create a payment session +++
