import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import firebase from '@/firebase/clientApp';
import { useUser } from '@/context/userContext';
import { useDocument } from '@nandorojo/swr-firestore';
import { Row, Col, Card, InputNumber, Button, Typography, Badge, notification } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { addToCart } from '@/utils/sharedFunctions';
import { Context } from '@/context/storeContext';

const { Title, Text, Paragraph } = Typography;

export default function ProductCard({ productData }) {
	const router = useRouter();
	const { user } = useUser();
	const [quantity, setQuantity] = useState(1);
	const [state, dispatch] = useContext(Context);

	/* 	const addToCart = async () => {
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
				const newArray = localCart.filter(({ pid }) => pid !== productData.pid);
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
	}; */

	return (
		<Badge
			style={{
				width: '35px',
				height: '35px',
				fontWeight: 'bold',
				borderRadius: '35px',
				lineHeight: '35px',
				paddingLeft: '3px',
			}}
			count={`-${parseInt(((productData.priceBase - productData.price) / productData.priceBase) * 100)}%`}
		>
			<Card
				hoverable
				style={{ width: 180, height: 300 }}
				cover={
					<img
						className={'pt-3'}
						style={{ width: 150, height: 150, margin: 'auto' }}
						alt="example"
						src={
							productData.images.length
								? productData.images[0].url
								: '/images/600px-No_image_available.png'
						}
						onClick={() => router.push(`/pd/${productData.pid}`)}
					/>
				}
				bodyStyle={{ padding: '0 1rem 1rem 1rem' }}
			>
				<Row>
					<Paragraph ellipsis={{ rows: 2 }}>{productData.title}</Paragraph>
				</Row>
				<Row justify="space-between">
					<Col span={16} className={'m-0'}>
						<Title level={4}>
							{new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(
								productData.price
							)}
						</Title>
					</Col>
					<Col span={8}>
						<InputNumber
							style={{ width: 56 }}
							min={1}
							max={10}
							defaultValue={1}
							onChange={(value) => setQuantity(value)}
						/>
					</Col>
				</Row>
				<Row>
					<Button
						block
						color="red-6"
						type="primary"
						onClick={() => addToCart(productData, quantity, user ? user.uid : null, dispatch)}
					>
						<ShoppingCartOutlined />
						{user && user.cart && user.cart.find(({ pid }) => pid === productData.pid)
							? 'Edit Cart'
							: 'Add to Cart'}
					</Button>
				</Row>
				<p>State: {JSON.stringify(state)}</p>
			</Card>
		</Badge>
	);
}
