import firebase from '@/firebase/clientApp';

export default async (req, res) => {
	let data = [];
	let error = null;
	let loading = false;
	return await new Promise((resolve) => {
		loading = true;
		firebase
			.firestore()
			.collection('misc')
			.doc('categories')
			.get()
			.then((doc) => {
				return res.status(200).json(doc.data());
			})
			.catch((err) => {
				error = err;
				return res.status(401);
			});
	});
};
