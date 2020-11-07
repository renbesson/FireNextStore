const functions = require('firebase-functions');

const { db } = require('./index');

// Secret Key from Stripe Dashboard
const stripe = require('stripe')(
	'sk_test_51HfovtLpuIUMARr9ITSvmnDid8zJ1V0sKPAbj5kE0qZ7ueA9NkYowHHlkGa5AKA1Sa35iHevylhNi1DjWe0NNdRo00UzF6OLGs'
);

const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 9);

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

// +++ Creates a new order id ---
const newId = nanoid();
// --- Creates a new order id +++

// +++ Creates the order's info into firestore ---
const createOrder = async (data, sessionId) => {
	const refOrders = await db.collection('orders');

	refOrders.doc(newId).set({
		sessionId,
		userOwner: data.clientId,
		dates: {
			createdOn: admin.firestore.Timestamp.now(),
			receivedOn: null,
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
			success_url: 'http://localhost:3000/cart/result?session_id={CHECKOUT_SESSION_ID}',
			cancel_url: 'http://localhost:3000/cart/',
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
