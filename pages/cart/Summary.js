import { Button, Card, Col, InputNumber, notification, Row, Select, Typography } from 'antd';
import firebase from '@/firebase/clientApp';
import { useState, useContext } from 'react';
import Form from 'antd/lib/form/Form';
import { useRouter } from 'next/router';
import { Context } from '@/context/storeContext';
import { customAlphabet } from 'nanoid';
import { useShoppingCart } from 'use-shopping-cart';
import CheckoutButton from '@components/CheckoutButton';

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 9);

const { Title, Text } = Typography;

const { Option } = Select;

export default function Summary({ productsData, user }) {
	const { redirectToCheckout, cartDetails, cartCount, formattedTotalPrice } = useShoppingCart();
	const getQuantity = (sku) => user && user.cart && user.cart.find((item) => item.sku === sku).quantity;
	const [addressSelected, setAddressSelected] = useState(null);
	const router = useRouter();
	const [state, dispatch] = useContext(Context);

	const placeOrder = () => {
		const refUsers = firebase.firestore().collection('users');

		if (user && user.cart && user.cart.length > 0) {
			refUsers
				.doc(user.uid)
				.update({
					orders: firebase.firestore.FieldValue.arrayUnion({
						orderNumber: nanoid(),
						dates: {
							createdOn: firebase.firestore.Timestamp.now(),
							receivedOn: null,
							preparedOn: null,
							outForDeliveryOn: null,
							deliveredOn: null,
						},
						status: 'processing',
						step: 0,
						deliveryAddress: {
							addressNickname: user.addresses[addressSelected].addressNickname,
							streetAddress: user.addresses[addressSelected].streetAddress,
							city: user.addresses[addressSelected].city,
							postalCode: user.addresses[addressSelected].postalCode,
						},
						items: productsData.map((product) => {
							return {
								name: product.name,
								price: product.price,
								sku: product.sku,
								imageUrl: product.images[0].url,
								quantity: getQuantity(product.sku),
							};
						}),
					}),
				})
				.then(
					notification.success({
						message: 'Order Placed Successfully',
						description: `Order "${'4521323'}" has been placed successfully.`,
					})
				)
				.catch((error) => {
					notification.error({
						message: 'Error Placing Order',
						description: `${error}`,
					});
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

	const checkout = () => {
		// Publishable Key from Stripe Dashboard
		const stripe = window.Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
		let sessionId;

		fetch('https://us-central1-nextjs-ecommerce.cloudfunctions.net/createOrderAndSession/', {
			method: 'POST',
			// Adding the order data to payload
			body: JSON.stringify({
				cartDetails,
				customerEmail: user.email,
				clientId: user.uid,
				shipping: {
					name: user.addresses[addressSelected].addressNickname,
					address: {
						city: user.addresses[addressSelected].city,
						line1: user.addresses[addressSelected].streetAddress,
						postal_code: user.addresses[addressSelected].postalCode,
						state: user.addresses[addressSelected].stateProvince,
						country: user.addresses[addressSelected].country,
					},
				},
			}),
		})
			.then((response) => {
				console.log(`response: ${response}`);
				return response.json();
			})
			.then((data) => {
				// Getting the session id from firebase function
				var body = JSON.parse(data.body);
				var sessionId = body.sessionId;
				return sessionId;
			})
			.then((sessionId) => {
				// Redirecting to payment form page
				console.log(`SessionID: ${sessionId}`);
				stripe
					.redirectToCheckout({
						sessionId: sessionId,
					})
					.then(function (result) {
						console.log(`SessionIDError: ${result}`);
						result.error.message;
					});
			});
	};

	return (
		<Card style={{ width: '100%' }} bodyStyle={{ padding: '1rem' }}>
			<Form onFinish={checkout}>
				<Form.Item
					name="deliveryAddress"
					rules={[{ required: true, message: 'Please select the delivery address.' }]}
				>
					<Select
						placeholder="Select the delivery Address"
						onChange={(value) =>
							value === 'none'
								? dispatch({ type: 'TOGGLE_BOOLEAN', boolean: 'newAddressDrawerOn' })
								: setAddressSelected(value)
						}
					>
						{user &&
							user.addresses &&
							user.addresses.map(({ addressNickname }, index) => (
								<Option key={index}>{addressNickname}</Option>
							))}
						<Option style={{ color: 'red' }} value={'none'}>
							Create New Address
						</Option>
					</Select>
				</Form.Item>
				<Form.Item>
					<Text>
						<b>Delivery Address: </b>
						{addressSelected &&
							user &&
							user.addresses &&
							`${user.addresses[addressSelected].streetAddress}, ${user.addresses[addressSelected].city}, ${user.addresses[addressSelected].postalCode}`}
					</Text>
				</Form.Item>
				<Form.Item>
					<Text suppressHydrationWarning={true}>
						<b>Total Items: </b>
						{cartCount}
					</Text>
				</Form.Item>
				<Form.Item>
					<Text suppressHydrationWarning={true}>
						<b>Total: </b>
						{formattedTotalPrice}
					</Text>
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit">
						Checkout
					</Button>
				</Form.Item>
			</Form>
		</Card>
	);
}
