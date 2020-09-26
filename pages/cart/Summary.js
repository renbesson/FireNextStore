import { Button, Card, Col, InputNumber, notification, Row, Typography } from 'antd';
import firebase from '@/firebase/clientApp';
import React from 'react';

const { Title, Text } = Typography;

export default function Summary({ productsData, user }) {
	const getQuantity = (pid) => user && user.cart && user.cart.find((item) => item.pid === pid).quantity;

	const placeOrder = () => {
		const refUsers = firebase.firestore().collection('users');

		if (user && user.cart && user.cart.length > 0) {
			refUsers.doc(user.uid).update({
				orders: firebase.firestore.FieldValue.arrayUnion({
					orderNumber: 4521323,
					dates: {
						createdOn: firebase.firestore.Timestamp.now(),
						receivedOn: null,
						preparedOn: null,
						outForDeliveryOn: null,
						deliveredOn: null,
					},
					status: 'processing',
					step: 0,
					deliveryAddress: { addressName: 'My Home' },
					items: productsData.map((product) => {
						return {
							title: product.title,
							price: product.price,
							pid: product.pid,
							imageUrl: product.images[0].url,
							quantity: getQuantity(product.pid),
						};
					}),
				}),
			});
			refUsers.doc(user.uid).update({
				cart: [],
			});
		} else {
			notification.warning({
				message: 'Cart Is Empty',
				description: '',
			});
		}
	};

	return (
		<Card style={{ width: '100%' }} bodyStyle={{ padding: '0 1rem 1rem 1rem' }}>
			<Row>
				<Col span={24} className={'m-2'}>
					<Text>Delivery Address: </Text>
				</Col>
				<Col span={24} className={'m-2'}>
					<Text>
						Total Items: {user && user.cart && user.cart.reduce((total, item) => item.quantity + total, 0)}
					</Text>
				</Col>
				<Col span={24} className={'m-2'}>
					<Text>
						Total:{' '}
						{productsData &&
							new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(
								productsData.reduce((total, item) => item.price * getQuantity(item.pid) + total, 0)
							)}
					</Text>
				</Col>
				<Col span={24} className={'m-2'}>
					<Button type="primary" onClick={placeOrder}>
						Checkout
					</Button>
				</Col>
			</Row>
		</Card>
	);
}
