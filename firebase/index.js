const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const validateCartItems = require('use-shopping-cart/src/serverUtil').validateCartItems;
/*
 * Product data can be loaded from anywhere. In this case, we’re loading it from
 * a local JSON file, but this could also come from an async call to your
 * inventory management service, a database query, or some other API call.
 *
 * The important thing is that the product info is loaded from somewhere trusted
 * so you know the pricing information is accurate.
 */

// The function for sending responses
function send(res, code, body) {
	res.send({
		statusCode: code,
		headers: { 'Access-Control-Allow-Origin': '*' },
		body: JSON.stringify(body),
	});
}

const handler = async (req, res) => {
	console.log(`REQ: ${JSON.stringify(req)}`);
	try {
		const productsRef = db.collection('products');
		const snapshot = await productsRef.get();
		const inventory = [];
		snapshot.forEach((doc) => {
			inventory.push(doc.data());
		});

		const productJSON = JSON.parse(req.body.lineItems);
		const line_items = validateCartItems(inventory, productJSON);
		console.log(`line_items: ${line_items}`);
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			billing_address_collection: 'auto',
			shipping_address_collection: {
				allowed_countries: ['US', 'CA'],
			},
			success_url: `http://localhost:3000/`,
			cancel_url: 'http://localhost:3000/',
			line_items,
		});
		send(res, 200, { sessionId: session.id });
		console.log(`SessionID: ${session.id}`);
		return;
	} catch (error) {
		console.error(`ErrorCatch: ${error}`);
		send(res, 500, { body: error.message });
		return;
	}
};

exports.checkout = functions.https.onRequest(handler);
