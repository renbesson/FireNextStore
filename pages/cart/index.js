import firebase from '@/firebase/clientApp';
import { useState, useEffect } from 'react';
import { useUser } from '../../context/userContext';
import { useCollectionSnap, useDocumentSnap } from 'hooks/firebaseHooks';
import ProductInCartCard from '@pages/cart/ProductInCartCard';
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
								console.log(change);
								if (change.type === 'added') {
									console.log('added');
									if (!products.some((item) => item.id === change.doc.id)) {
										setProducts((prevProducts) => [...prevProducts, change.doc.data()]);
									}
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
								<Col xs={24} lg={16} key={product.id}>
									<ProductInCartCard productData={product} user={user} />
								</Col>
							);
						} else return;
					})}
			</Row>
		</div>
	);
}
