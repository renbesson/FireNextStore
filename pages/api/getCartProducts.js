import firebase from '@/firebase/clientApp';

export default (req, res) => {
	let products = [];
	firebase
		.firestore()
		.collection('products')
		.where('id', 'in', '')
		.get()
		.then((querySnapshot) => {
			querySnapshot.forEach((product) => {
				products.push(product.data());
				console.log(product.data());
			});
			res.json(products);
		})
		.catch((error) => {
			res.json({ error });
		});
};
