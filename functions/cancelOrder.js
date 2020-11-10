const functions = require('firebase-functions');

const { db, firestore } = require('./index');

// Secret Key from Stripe Dashboard
const stripe = require('stripe')(
	'sk_test_51HfovtLpuIUMARr9ITSvmnDid8zJ1V0sKPAbj5kE0qZ7ueA9NkYowHHlkGa5AKA1Sa35iHevylhNi1DjWe0NNdRo00UzF6OLGs'
);

// +++ Creates the order's info into firestore ---
const createOrder = async (data, sessionId) => {
	const refOrders = await db.collection('orders');

	refOrders.doc(data.orderId).update({
		sessionId,
		owner: data.clientId,
		dates: {
            cancelledOn: firestore.Timestamp.now(),
            createdOn: null,
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
exports.cancelOrder = functions.https.onCall(async (data, context) => {
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
			cancel_url: 'http://localhost:3000/cart/result?session_id={CHECKOUT_SESSION_ID}',
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
