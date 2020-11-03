import { useState } from 'react';
import firebase from '@/firebase/clientApp';
import { useUser } from '@/context/userContext';
import { useDocument } from '@nandorojo/swr-firestore';
import { Button, Card, Col, Divider, Input, InputNumber, notification, Row, Typography } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import NumberFormat from 'react-number-format';
import { addToCart, updateToCart } from '@/utils/sharedFunctions';
import { useShoppingCart } from 'use-shopping-cart';

const { Text, Title } = Typography;

export default function PdSideCard({ productData }) {
	const { user } = useUser();
	const [quantity, setQuantity] = useState(1);
	const { update } = useDocument(user && `users/${user.uid}`);
	const { addItem, setItemQuantity, cartDetails, cartCount } = useShoppingCart();

	const itemInCart = cartDetails && cartDetails[productData.sku];

	const PriceTitles = () => {
		if (productData.priceBase > productData.priceCurrent) {
			return (
				<>
					<Title className={'m-0'} level={4} delete>
						{`Was: ${new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(
							productData.priceBase
						)}`}
					</Title>
					<Title className={'m-0'} level={2}>
						{`Now: ${new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(
							productData.priceCurrent
						)}`}
					</Title>
				</>
			);
		} else {
			return (
				<Title className={'m-0'} level={2}>
					{`${new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(
						productData.priceCurrent
					)}`}
				</Title>
			);
		}
	};

	return (
		<Card style={{ height: '350px' }}>
			<button onClick={() => console.log(cartDetails)}>dasda</button>
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
											description: `Product "${productData.name}" is already in the cart with this quantity.`,
									  })
									: setItemQuantity(productData.sku, quantity)
								: addItem(productData, quantity)
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
