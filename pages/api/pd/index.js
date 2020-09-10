import firebase from '@/firebase/clientApp';

export default (req, res) => {
	let products = [];
	firebase
		.firestore()
		.collection('products')
		.get()
		.then((querySnapshot) => {
			querySnapshot.forEach((product) => {
				products.push(product.data());
			});
			res.json(products);
		})
		.catch((error) => {
			res.json({ error });
		});
};
