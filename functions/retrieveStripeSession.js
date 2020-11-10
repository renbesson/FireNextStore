const functions = require('firebase-functions');

// Secret Key from Stripe Dashboard
const stripe = require('stripe')(
	'sk_test_51HfovtLpuIUMARr9ITSvmnDid8zJ1V0sKPAbj5kE0qZ7ueA9NkYowHHlkGa5AKA1Sa35iHevylhNi1DjWe0NNdRo00UzF6OLGs'
);

exports.retrieveStripeSession = functions.https.onCall(async (data, context) => {
    console.log(`DATA: ${JSON.stringify(data)}`)
	return await stripe.checkout.sessions.retrieve(data.sessionId);
});
