import firebase from '@/firebase/clientApp';

export default (req, res) => {
	console.log('initializing...', req.query.pid);
	firebase
		.collection('products')
		.doc(req.query.pid)
		.get()
		.then((doc) => {
			res.json(doc.data());
			console.log(doc.data());
		})
		.catch((error) => {
			res.json({ error });
		});
};
