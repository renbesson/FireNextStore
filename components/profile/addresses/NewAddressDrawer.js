import { useState, useContext } from 'react';
import firebase from '@/firebase/clientApp';
import { Grid, Form, Input, Button, Drawer, notification } from 'antd';
import { useUser } from '@/context/userContext';
import { Context } from '@/context/storeContext';

export default function NewAddressDrawer() {
	const { user } = useUser();
	const [form] = Form.useForm();
	const [state, dispatch] = useContext(Context);
	const [newAddress, setNewAddress] = useState({
		addressNickname: ',',
		streetAddress: '',
		city: '',
		postalCode: '',
		dateCreated: firebase.firestore.Timestamp.now(),
		dateModified: firebase.firestore.Timestamp.now(),
	});

	const screens = Grid.useBreakpoint();

	const createAddress = () => {
		let hasError = null;
		const inexistent = !user.addresses.some((item) => item.addressNickname === newAddress.addressNickname);
		const hasMoreThanFive = user.addresses.length > 5;
		try {
			const refAddress = firebase.firestore().collection('users');
			if (inexistent && !hasMoreThanFive) {
				refAddress.doc(user.uid).update({
					addresses: firebase.firestore.FieldValue.arrayUnion(newAddress),
				});
			}
		} catch (error) {
			notification.error({
				message: 'Error Creating Address',
				description: `${error}`,
			});
			console.error(error);
			hasError = true;
		} finally {
			if (!inexistent) {
				notification.warning({
					message: 'Address Already Exists',
					description: `Address "${newAddress.addressNickname}" already exists.`,
					style: { backgroundColor: 'rgba(230, 230, 50, .15)', backdropFilter: 'blur(5px)' },
				});
			}
			if (hasMoreThanFive) {
				notification.warning({
					message: 'Maximum Address Limit',
					description: `Maximum address limit reached. Remove existing address in order to create new ones.`,
				});
			}
			if (!hasError && inexistent && !hasMoreThanFive) {
				form.resetFields();
				dispatch({ type: 'TOGGLE_BOOLEAN', boolean: 'newAddressDrawerOn' });
				notification.success({
					message: 'Address Created Successfully',
					description: `Address "${newAddress.addressNickname}" has been created successfully.`,
					style: { backgroundColor: 'rgba(0, 255, 0, .15)', backdropFilter: 'blur(5px)' },
				});
			}
		}
	};

	return (
		<Drawer
			title="Create Address"
			placement="right"
			closable={false}
			onClose={() => dispatch({ type: 'TOGGLE_BOOLEAN', boolean: 'newAddressDrawerOn' })}
			visible={state.newAddressDrawerOn}
			width={screens.xs ? '80vw' : '30vw'}
			style={{ backgroundColor: 'rgba(255, 255, 255, .15)', backdropFilter: 'blur(5px)' }}
		>
			<Form layout="vertical" name="newAddressForm" form={form} onFinish={createAddress}>
				<Form.Item
					label="Address Nickname"
					name="addressNickname"
					rules={[{ required: true, message: 'Please input your username!' }]}
				>
					<Input
						placeholder="Address Nickname"
						value={newAddress.addressNickname}
						onChange={(e) => setNewAddress({ ...newAddress, addressNickname: e.target.value })}
					/>
				</Form.Item>
				<Form.Item
					label="Street Address"
					name="streetAddress"
					rules={[{ required: true, message: 'Please input your username!' }]}
				>
					<Input
						placeholder="Street Address"
						value={newAddress.streetAddress}
						onChange={(e) => setNewAddress({ ...newAddress, streetAddress: e.target.value })}
					/>
				</Form.Item>
				<Form.Item
					label="Postal Code"
					name="postalCode"
					rules={[{ required: true, message: 'Please input your username!' }]}
				>
					<Input
						placeholder="Postal Code"
						value={newAddress.postalCode}
						onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
					/>
				</Form.Item>
				<Form.Item
					label="City"
					name="city"
					rules={[{ required: true, message: 'Please input your username!' }]}
				>
					<Input
						placeholder="City"
						value={newAddress.city}
						onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
					/>
				</Form.Item>
				<Form.Item
					label="State/Province"
					name="stateProvince"
					rules={[{ required: true, message: 'Please input your username!' }]}
				>
					<Input
						placeholder="State/Province"
						value={newAddress.stateProvince}
						onChange={(e) => setNewAddress({ ...newAddress, stateProvince: e.target.value })}
					/>
				</Form.Item>
				<Form.Item
					label="Country"
					name="country"
					rules={[{ required: true, message: 'Please input your username!' }]}
				>
					<Input
						placeholder="Country"
						value={newAddress.country}
						onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
					/>
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit">
						Create Address
					</Button>
				</Form.Item>
			</Form>
		</Drawer>
	);
}
