import firebase from '@/firebase/clientApp';
import { useState, useEffect } from 'react';
import { useUser } from '../context/userContext';
import { useCollectionSnap, useDocumentSnap } from 'hooks/firebaseHooks';
import ProductInCartCard from '@/components/ProductInCartCard';
import { Row, Col, Card } from 'antd';

export default function cart() {
	const { user } = useUser();
	const pids = user && user.cart ? user.cart.map(({ pid }) => pid) : ['none'];
	const [products, setProducts] = useState([]);

	useEffect(() => {
		const unsubscribe = firebase
			.firestore()
			.collection('products')
			.where('id', 'in', pids)
			.onSnapshot(
				(querySnapshot) => {
					try {
						if (querySnapshot.empty) {
							console.error('Collection not Found!');
						} else {
							querySnapshot.docChanges().forEach((change) => {
								if (change.type === 'added') {
									console.log('added');
									if (!products.some((item) => item.id === change.doc.id)) {
										setProducts((prevProducts) => [...prevProducts, change.doc.data()]);
									}
								} else if (change.type === 'modified') {
									console.log('modified');
									setProducts((prevProducts) => {
										let newProducts = [...prevProducts];
										const productIndex = newProducts.findIndex((item) => item.id === change.doc.id);
										newProducts.splice(productIndex, 1, change.doc.data());
										return newProducts;
									});
								} else if (change.type === 'removed') {
									console.log('removed');
									setProducts((prevProducts) => {
										let newProducts = [...prevProducts];
										const productIndex = newProducts.findIndex((item) => item.id === change.doc.id);
										newProducts.splice(productIndex, 1);
										return newProducts;
									});
								}
							});
						}
					} catch (error) {
						console.error(error);
					} finally {
					}
				},
				(error) => {
					console.error(error);
				}
			);
		return () => unsubscribe();
	}, [pids]);

	return (
		<div>
			<Row align="middle" gutter={[24, 24]}>
				{products &&
					products.map((product) => {
						// The if statement prevent a console error since the product is first created and after is injected the id in the firebase document.
						if (product.id) {
							return (
								<Col span={16} key={product.id}>
									<ProductInCartCard productData={product} />
								</Col>
							);
						} else return;
					})}
			</Row>
		</div>
	);
}
