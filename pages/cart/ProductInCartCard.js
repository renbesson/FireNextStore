import firebase from '@/firebase/clientApp';
import { Row, Col, Card, Typography, InputNumber, Button, notification } from 'antd';
import Form from 'antd/lib/form/Form';
import { useState } from 'react';

const { Title, Text } = Typography;

export default function ProductInCartCard({ productData, user }) {
	const itemInCart = user.cart.find((item) => item.pid === productData.id);
	const [newQuantity, setNewQuantity] = useState(itemInCart ? itemInCart.quantity : undefined);

	const updateCart = () => {
		try {
			const refUsers = firebase.firestore().collection('users');
			if (!user.cart.some((item) => item.quantity === newQuantity)) {
				refUsers.doc(user.uid).update({
					cart: firebase.firestore.FieldValue.arrayRemove(itemInCart),
				});
				refUsers
					.doc(user.uid)
					.update({
						cart: firebase.firestore.FieldValue.arrayUnion({
							pid: productData.id,
							quantity: newQuantity,
						}),
					})
					.then(() => {
						notification.success({
							message: 'Cart Updated Successfully',
							description: `Product "${productData.title}" has been successfully updated to the cart.`,
						});
					});
			}
		} catch (error) {
			notification.error({
				message: 'Cart Not Updated',
				description: `${error}`,
			});
		}
	};

	const removeFromCart = () => {
		try {
			const refUsers = firebase.firestore().collection('users');
			if (user.cart.find((item) => item === itemInCart)) {
				refUsers
					.doc(user.uid)
					.update({
						cart: firebase.firestore.FieldValue.arrayRemove(itemInCart),
					})
					.then(() => {
						notification.success({
							message: 'Cart Updated Successfully',
							description: `Product "${productData.title}" has been successfully removed from the cart.`,
						});
					});
			}
		} catch (error) {
			notification.error({
				message: 'Cart Not Updated',
				description: `${error}`,
			});
		}
	};

	return (
		<Card hoverable style={{ width: '100%' }} bodyStyle={{ padding: '0 1rem 1rem 1rem' }}>
			<Row>
				<Col className={'m-2'}>
					<img
						style={{ width: 150, height: 150 }}
						alt="example"
						src={
							productData.images.length
								? productData.images[0].url
								: '/images/600px-No_image_available.png'
						}
					/>
				</Col>
				<Col className={'m-2'}>
					<Row>
						<Col>
							<Text>{productData.title}</Text>
						</Col>
					</Row>
					<Row>
						<Col>
							<Text>Code: {productData.productCode}</Text>
						</Col>
					</Row>
					<Row justify="space-between" className={'p-2'}>
						<Col>
							<Title level={4}>
								{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
									productData.price
								)}
							</Title>
						</Col>
						<Col>
							<InputNumber
								style={{ width: 56 }}
								onChange={(value) => setNewQuantity(value)}
								min={1}
								max={10}
								value={newQuantity}
								defaultValue={newQuantity}
							/>

							<Button onClick={updateCart}>Update</Button>
						</Col>
					</Row>
					<Row>
						<Col>
							<Button block type="primary" onClick={removeFromCart}>
								Remove from Cart
							</Button>
						</Col>
					</Row>
				</Col>
			</Row>
		</Card>
	);
}
