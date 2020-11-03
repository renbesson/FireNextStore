const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

// We should install required packages (stripe, body-parser) using npm install inside /functions/ folder
const bodyParser = require('body-parser');
const cors = require('cors')({ origin: true });
const express = require('express');

// Secret Key from Stripe Dashboard
const stripe = require('stripe')(
	'sk_test_51HfovtLpuIUMARr9ITSvmnDid8zJ1V0sKPAbj5kE0qZ7ueA9NkYowHHlkGa5AKA1Sa35iHevylhNi1DjWe0NNdRo00UzF6OLGs'
);

// The function for sending responses
function send(res, code, body) {
	res.send({
		statusCode: code,
		headers: { 'Access-Control-Allow-Origin': '*' },
		body: JSON.stringify(body),
	});
}

// Our app has to use express
const createOrderAndSessionApp = express();

// Our app has to use cors
createOrderAndSessionApp.use(cors);

// +++ Validate of cartDetails' info hasn't been changed ---
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

// +++ The function that get data from front-end and create a payment session ---
async function createOrderAndSession(req, res) {
	const body = JSON.parse(req.body);

	// +++ Collect inventory from firestore and compares with cartDetails ---
	const productsRef = db.collection('products');
	const snapshot = await productsRef.get();
	const inventory = [];
	snapshot.forEach((doc) => {
		inventory.push(doc.data());
	});

	const cartDetails = body.cartDetails;

	const line_items = validateCartItems(inventory, cartDetails);
	// --- Collect inventory from firestore and compares with cartDetails +++

	// +++ Create stripe's checkout session ---
	stripe.checkout.sessions
		.create({
			success_url: 'http://localhost:3000/cart/result?session_id={CHECKOUT_SESSION_ID}',
			cancel_url: 'http://localhost:3000/cart/',
			mode: 'payment',
			payment_method_types: ['card'],
			line_items,
			customer_email: body.customerEmail,
		})
		.then((session) => {
			// Here we can do something with the session id, e.g. add it to the order data in firebase database
			// Sending the session id to front-end
			send(res, 200, {
				sessionId: session.id,
			});
			return;
		})
		.catch((error) => {
			console.log(`Create Session Error: ${error}`);
			return;
		});
	// --- Create stripe's checkout session +++
}
// --- The function that get data from front-end and create a payment session +++

// Creating a route
createOrderAndSessionApp.post('/', (req, res) => {
	try {
		createOrderAndSession(req, res);
	} catch (e) {
		console.log(e);
		send(res, 500, {
			error: `The server received an unexpected error. Please try again and contact the site admin if the error persists.`,
		});
	}
});
// Exporting our http function
exports.createOrderAndSession = functions.https.onRequest(createOrderAndSessionApp);

////////////////////////////////////////

// +++ ---
// --- +++
