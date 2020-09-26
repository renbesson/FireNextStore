import { useState } from 'react';
import { useRouter } from 'next/router';
import { Layout, Row, Col, Card, InputNumber, Button, Typography, Badge } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import firebase from '@/firebase/clientApp';
import { useUser } from '@/context/userContext';

const { Title, Text } = Typography;

export default function ProductCard({ productData }) {
	const router = useRouter();
	const { user } = useUser();
	const [quantity, setQuantity] = useState(1);

	const addToCart = async () => {
		const refUsers = firebase.firestore().collection('users');

		// Error prevention case cart doesn't exist
		if (!user.cart) {
			await refUsers.doc(user.uid).update({
				cart: [],
			});
		}

		const itemInCart = await user.cart.find((item) => item.pid === productData.pid);

		//when the product is not in the cart
		if (itemInCart !== undefined) {
			if (itemInCart.quantity !== quantity) {
				await refUsers.doc(user.uid).update({
					cart: firebase.firestore.FieldValue.arrayRemove(itemInCart),
				});
				await refUsers.doc(user.uid).update({
					cart: firebase.firestore.FieldValue.arrayUnion({
						pid: productData.pid,
						quantity,
					}),
				});
			}
		} else {
			await refUsers.doc(user.uid).update({
				cart: firebase.firestore.FieldValue.arrayUnion({
					pid: productData.pid,
					quantity,
				}),
			});
		}
	};

	return (
		<Badge count={'-15%'}>
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
				<Row className={'pt-2'}>
					<Text>{productData.title}</Text>
				</Row>
				<Row justify="space-between" className={'pt-2'}>
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
				<Row className={'pt-2'}>
					<Button block color="red-6" type="primary" onClick={addToCart}>
						<ShoppingCartOutlined /> Add to Cart
					</Button>
				</Row>
			</Card>
		</Badge>
	);
}
