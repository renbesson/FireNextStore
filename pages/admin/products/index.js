import firebase from '@/firebase/clientApp';
import { useState, useEffect } from 'react';
import ProductListAdmin from '@/components/admin/products/ProductListAdmin';
import { Typography } from 'antd';

const { Title, Text } = Typography;

indexProductsAdmin.AdminLayout = true;

export default function indexProductsAdmin() {
	const [products, setProducts] = useState([]);

	useEffect(() => {
		const refProducts = firebase.firestore().collection('products');

		const unsubscribe = refProducts.onSnapshot((querySnapshot) => {
			querySnapshot.docChanges().forEach((change) => {
				if (!products.some((product) => product.id === change.doc.id)) {
					if (change.type === 'added') {
						setProducts((prevProducts) => [...prevProducts, change.doc.data()]);
					} else if (change.type === 'modified') {
						setProducts((prevProducts) => {
							let newProducts = [...prevProducts];
							const productIndex = newProducts.findIndex((product) => product.id === change.doc.id);
							newProducts.splice(productIndex, 1, change.doc.data());
							return newProducts;
						});
					} else if (change.type === 'removed') {
						setProducts((prevProducts) => {
							let newProducts = [...prevProducts];
							const productIndex = newProducts.findIndex((product) => product.id === change.doc.id);
							newProducts.splice(productIndex, 1);
							return newProducts;
						});
					}
				}
			});
		});
		return () => unsubscribe();
	}, []);

	if (products) {
		return (
			<>
				{/* {error && <Title>Error: {JSON.stringify(error)}</Title>}
				{loading && <Title>Collection: Loading...</Title>} */}
				<ProductListAdmin products={products} />
			</>
		);
	} else {
		return <></>;
	}
}
