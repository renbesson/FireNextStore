import { useState } from 'react';
import firebase from '@/firebase/clientApp';
import { useUser } from '@/context/userContext';
import { useDocument } from '@nandorojo/swr-firestore';
import { Button, Card, Col, Divider, Input, InputNumber, notification, Row, Typography } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import NumberFormat from 'react-number-format';
import { addToCart, updateToCart } from '@/utils/sharedFunctions';

const { Text, Title } = Typography;

export default function PdSideCard({ productData }) {
	const { user } = useUser();
	const [quantity, setQuantity] = useState(1);
	const { update } = useDocument(user && `users/${user.uid}`);

	const itemInCart = user && user.cart && user.cart.find(({ pid }) => pid === productData.pid);

	const PriceTitles = () => {
		if (productData.priceBase > productData.price) {
			return (
				<>
					<Title className={'m-0'} level={4} delete>
						{`Was: ${new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(
							productData.priceBase
						)}`}
					</Title>
					<Title className={'m-0'} level={2}>
						{`Now: ${new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(
							productData.price
						)}`}
					</Title>
				</>
			);
		} else {
			return (
				<Title className={'m-0'} level={2}>
					{`${new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(
						productData.price
					)}`}
				</Title>
			);
		}
	};

	return (
		<Card style={{ height: '350px' }}>
			<Row>
				<Col>
					<PriceTitles />
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
				<Col lg={7} xs={24}>
					<InputNumber
						style={{ width: 56 }}
						min={1}
						max={10}
						size="large"
						defaultValue={1}
						onChange={(value) => setQuantity(value)}
					/>
				</Col>
				<Col lg={17} xs={24}>
					<Button
						size="large"
						block
						color="red-6"
						type="primary"
						onClick={() =>
							itemInCart
								? itemInCart && itemInCart.quantity === quantity
									? notification.warning({
											message: 'Product Already in the Cart',
											description: `Product "${productData.title}" is already in the cart with this quantity.`,
									  })
									: updateToCart(productData, itemInCart.quantity, quantity, user && user.uid)
								: addToCart(productData, quantity, user && user.uid)
						}
					>
						<ShoppingCartOutlined />
						{user && user.cart && itemInCart ? 'Update Cart' : 'Add to Cart'}
					</Button>
				</Col>
			</Row>
		</Card>
	);
}
