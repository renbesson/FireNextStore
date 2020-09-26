import firebase from '@/firebase/clientApp';

export default (req, res) => {
	const pids = JSON.parse(req.headers.payload);

	let data = [];
	let error = null;
	let loading = false;
	return new Promise((resolve) => {
		loading = true;
		firebase
			.firestore()
			.collection('products')
			.where('id', 'in', pids)
			.onSnapshot((querySnapshot) => {
				try {
					if (querySnapshot.empty) {
						console.error('Collection not Found!');
						loading = false;
					} else {
						querySnapshot.docChanges().forEach((change) => {
							if (change.type === 'added') {
								// console.log('added');
								if (!data.some((item) => item.id === change.doc.id)) {
									data.push(change.doc.data());
								}
							} else if (change.type === 'modified') {
								// console.log('modified');
								const productIndex = data.findIndex((item) => item.id === change.doc.id);
								data.splice(productIndex, 1, change.doc.data());
							} else if (change.type === 'removed') {
								// console.log('removed');
								const productIndex = data.findIndex((item) => item.id === change.doc.id);
								data.splice(productIndex, 1);
							}
						});
						setLoading(false);
					}
				} catch (err) {
					error = err;
					return res.status(401);
				} finally {
					loading = false;
					return res.status(200).json(data);
				}
			});
	});
};
