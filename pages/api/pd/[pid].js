import firebase from '@/firebase/clientApp';

export default (req, res) => {
	firebase
		.firestore()
		.collection('products')
		.doc(req.query.pid)
		.get()
		.then((doc) => {
			res.json(doc.data());
		})
		.catch((error) => {
			res.json({ error });
		});
};
1;