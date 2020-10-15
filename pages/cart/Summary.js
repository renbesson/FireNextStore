import { Button, Card, Col, InputNumber, notification, Row, Select, Typography } from 'antd';
import firebase from '@/firebase/clientApp';
import { useState, useContext } from 'react';
import Form from 'antd/lib/form/Form';
import { useRouter } from 'next/router';
import { Context } from '@/context/storeContext';

const { Title, Text } = Typography;

const { Option } = Select;

export default function Summary({ productsData, user }) {
	const getQuantity = (pid) => user && user.cart && user.cart.find((item) => item.pid === pid).quantity;
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
						deliveryAddress: {
							addressNickname: user.addresses[addressSelected].addressNickname,
							streetAddress: user.addresses[addressSelected].streetAddress,
							city: user.addresses[addressSelected].city,
							postalCode: user.addresses[addressSelected].postalCode,
						},
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

	return (
		<Card style={{ width: '100%' }} bodyStyle={{ padding: '1rem' }}>
			<Form onFinish={placeOrder}>
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
					<Text>
						<b>Total Items: </b>
						{user && user.cart && user.cart.reduce((total, item) => item.quantity + total, 0)}
					</Text>
				</Form.Item>
				<Form.Item>
					<Text>
						<b>Total: </b>
						{productsData &&
							new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(
								productsData.reduce((total, item) => item.price * getQuantity(item.pid) + total, 0)
							)}
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
