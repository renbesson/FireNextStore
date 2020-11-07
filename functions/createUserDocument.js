const functions = require('firebase-functions');

const { db } = require('./index');

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
