import { Button, Card, notification, Select, Typography } from 'antd';
import firebase from '@/firebase/clientApp';
import { useState, useContext } from 'react';
import Form from 'antd/lib/form/Form';
import { Context } from '@/context/storeContext';
import { useShoppingCart } from 'use-shopping-cart';

const { Title, Text } = Typography;

const { Option } = Select;

export default function Summary({ productsData, user }) {
	const { cartDetails, clearCart, cartCount, formattedTotalPrice, redirectToCheckout } = useShoppingCart();
	const [addressSelected, setAddressSelected] = useState(null);
	const [state, dispatch] = useContext(Context);

	const checkout = () => {
		if (cartCount > 0) {
			const createOrderAndSession = firebase.functions().httpsCallable('createOrderAndSession');

			createOrderAndSession({
				cartDetails,
				customerEmail: user.email,
				clientId: user.uid,
				deliveryAddress: user.addresses[addressSelected],
				productsData,
			})
				.then((result) => {
					notification.success({
						message: 'Order Created Successfully',
						description: `Order "${result.data.orderId}" has been created successfully. You are being redirected to the payment page`,
					});
					clearCart();
					setTimeout(async () => {
						await redirectToCheckout({
							sessionId: result.data.sessionId,
						}).then(function (result) {
							console.log(`SessionIDError: ${result}`);
							result.error.message;
						});
					}, 3000);
				})
				.catch((error) => {
					notification.error({
						message: 'Error Placing Order',
						description: `${error}`,
					});
				});
		} else {
			notification.warning({
				message: 'Cart Is Empty',
				description: '',
			});
		}
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
					<Text suppressHydrationWarning>
						<b>Total Items: </b>
						{cartCount}
					</Text>
				</Form.Item>
				<Form.Item>
					<Text suppressHydrationWarning>
						<b>Total: </b>
						{formattedTotalPrice}
					</Text>
				</Form.Item>
				<Form.Item>
					<Button suppressHydrationWarning type="primary" htmlType="submit">
						Checkout
					</Button>
				</Form.Item>
			</Form>
		</Card>
	);
}
