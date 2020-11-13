const functions = require('firebase-functions');

const { db, firestore } = require('./index');

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
