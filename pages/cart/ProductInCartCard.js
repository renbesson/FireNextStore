import firebase from '@/firebase/clientApp';
import { removeFromCart, updateToCart } from '@utils/sharedFunctions';
import { Row, Col, Card, Typography, InputNumber, Button, notification } from 'antd';
import Form from 'antd/lib/form/Form';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useShoppingCart } from 'use-shopping-cart';

const { Title, Text } = Typography;

export default function ProductInCartCard({ productData, user }) {
	const { setItemQuantity, removeItem, cartDetails } = useShoppingCart();
	const itemInCart = cartDetails[productData.sku];
	const [quantity, setQuantity] = useState(itemInCart ? itemInCart.quantity : undefined);
	const router = useRouter();

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
							<Button className={'p-0'} type="link" onClick={() => router.push(`/pd/${productData.sku}`)}>
								{productData.name}
							</Button>
						</Col>
					</Row>
					<Row>
						<Col>
							<Text>Code: {productData.sku}</Text>
						</Col>
					</Row>
					<Row justify="space-between" className={'p-2'}>
						<Col>
							<Title level={4}>
								{new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(
									productData.priceCurrent
								)}
							</Title>
						</Col>
						<Col>
							<InputNumber
								style={{ width: 56 }}
								onChange={(value) => setQuantity(value)}
								min={1}
								max={10}
								value={window !== undefined ? quantity : undefined}
								defaultValue={window !== undefined ? quantity : undefined}
							/>

							<Button onClick={() => setItemQuantity(productData.sku, quantity)}>Update</Button>
						</Col>
					</Row>
					<Row>
						<Col>
							<Button block type="primary" onClick={() => removeItem(productData.sku)}>
								Remove from Cart
							</Button>
						</Col>
					</Row>
				</Col>
			</Row>
		</Card>
	);
}
