import { useState } from 'react';
import firebase from '@/firebase/clientApp';
import { useUser } from '@/context/userContext';
import { useDocument } from '@nandorojo/swr-firestore';
import { Button, Card, Col, Divider, Input, InputNumber, notification, Row, Typography } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import NumberFormat from 'react-number-format';

const { Text, Title } = Typography;

export default function PdSideCard({ productData }) {
	const { user } = useUser();
	const [quantity, setQuantity] = useState(1);
	const { update } = useDocument(user && `users/${user.uid}`);

	const addToCart = async () => {
		if (!user) {
			const localCart = JSON.parse(localStorage.getItem('cart'));
			const alreadyInCart = localCart && localCart.find(({ pid }) => pid === productData.pid);

			if (localCart && !alreadyInCart) {
				localStorage.setItem(
					'cart',
					JSON.stringify([
						...localCart,
						{
							pid: productData.pid,
							quantity,
						},
					])
				);
			} else if (alreadyInCart) {
				console.log('alreadyInCart');
				const newArray = localCart.filter(({ pid }) => pid !== productData.pid);
				console.log(newArray);
				localStorage.setItem(
					'cart',
					JSON.stringify([
						...newArray,
						{
							pid: productData.pid,
							quantity,
						},
					])
				);
			} else {
				await localStorage.setItem(
					'cart',
					JSON.stringify([
						{
							pid: productData.pid,
							quantity,
						},
					])
				);
			}
		}

		// Error prevention case cart doesn't exist
		if (user && !user.cart) {
			await update({
				cart: [],
			});
		}

		if (user && user.cart) {
			const itemInCart = await user.cart.find((item) => item.pid === productData.pid);

			let hasError = false;
			let hasChange = false;
			try {
				if (itemInCart !== undefined) {
					//when the product is in the cart
					if (itemInCart.quantity !== quantity) {
						await update({
							cart: firebase.firestore.FieldValue.arrayRemove(itemInCart),
						});
						await update({
							cart: firebase.firestore.FieldValue.arrayUnion({
								pid: productData.pid,
								quantity,
							}),
						});
						hasChange = true;
					} else {
						notification.warning({
							message: 'Product Already in the Cart',
							description: `Product "${productData.title}" is already in the cart with this quantity.`,
						});
					}
				} else {
					//when the product is not in the cart
					await update({
						cart: firebase.firestore.FieldValue.arrayUnion({
							pid: productData.pid,
							quantity,
						}),
					});
					hasChange = true;
				}
			} catch (error) {
				notification.error({
					message: 'Error Adding To Cart',
					description: `${error}`,
				});
				hasError = true;
			} finally {
				if (!hasError && hasChange) {
					notification.success({
						message: 'Product Successfully Added',
						description: `Product "${productData.title}" has been successfully added to the cart.`,
					});
				}
			}
		}
	};

	return (
		<Card style={{ minHeight: '350px' }}>
			<Row>
				<Col>
					<Title className={'m-0'} level={2}>
						{new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(
							productData.price
						)}
					</Title>
					<Text>SKU: {productData.sku}</Text>
				</Col>
			</Row>
			<Divider />
			<Row justify="center">
				<Col>
					<NumberFormat
						customInput={Input}
						format="###-###"
						mask="_"
						placeholder="Postal Code"
						onChange={(e) => console.log(e.target.value)}
					/>
				</Col>
			</Row>
			<Divider />
			<Row justify="center">
				<Col>
					<InputNumber
						style={{ width: 56 }}
						min={1}
						max={10}
						size="large"
						defaultValue={1}
						onChange={(value) => setQuantity(value)}
					/>
				</Col>
				<Col>
					<Button size="large" block color="red-6" type="primary" onClick={addToCart}>
						<ShoppingCartOutlined />
						{user && user.cart && user.cart.find(({ pid }) => pid === productData.pid)
							? 'Edit Cart'
							: 'Add to Cart'}
					</Button>
				</Col>
			</Row>
		</Card>
	);
}
