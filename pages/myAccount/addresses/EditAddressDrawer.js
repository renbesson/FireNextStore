import { useEffect, useState } from 'react';
import firebase from '@/firebase/clientApp';
import { useUser } from '@/context/userContext';
import { Form, Input, Button, notification, Drawer, Grid } from 'antd';

export default function EditAddressDrawer({ drawerOn, setDrawerOn, address }) {
	const { loadingUser, user } = useUser();
	const [form] = Form.useForm();
	const [editedAddress, setEditedAddress] = useState(address);
	const refUsers = firebase.firestore().collection('users');
	const selectedAddress = user && user.addresses && user.addresses.find((item) => item === address);

	const screens = Grid.useBreakpoint();

	useEffect(() => {
		setEditedAddress(address);
		form.setFieldsValue({
			['addressNickname']: address.addressNickname,
			['streetAddress']: address.streetAddress,
			['city']: address.city,
			['postalCode']: address.postalCode,
		});
		return () => {};
	}, [address]);

	const editAddress = async () => {
		let hasError = null;
		let hasChange = false;
		try {
			if (editedAddress !== selectedAddress) {
				await refUsers.doc(user.uid).update({
					addresses: firebase.firestore.FieldValue.arrayRemove(selectedAddress),
				});
				await refUsers.doc(user.uid).update({
					addresses: firebase.firestore.FieldValue.arrayUnion({
						...editedAddress,
						dateModified: firebase.firestore.Timestamp.now(),
					}),
				});
				hasChange = true;
			}
		} catch (error) {
			notification.error({
				message: 'Error Updating Address',
				description: `${error}`,
			});
			console.error(error);
			hasError = true;
		} finally {
			if (!hasChange) {
				notification.warning({
					message: 'Address Has No Change',
					description: `Address "${editedAddress.addressNickname}" has no change to update.`,
				});
			}
			if (!hasError && hasChange) {
				form.resetFields();
				notification.success({
					message: 'Address Changed Successfully',
					description: `Address "${editedAddress.addressNickname}" has been changed successfully.`,
				});
				setDrawerOn(false);
			}
		}
	};

	const removeAddress = async () => {
		let hasError = null;
		try {
			await refUsers.doc(user.uid).update({
				addresses: firebase.firestore.FieldValue.arrayRemove(selectedAddress),
			});
		} catch (error) {
			notification.error({
				message: 'Error Removing Address',
				description: `${error}`,
			});
			console.error(error);
			hasError = true;
		} finally {
			if (!hasError) {
				form.resetFields();
				notification.success({
					message: 'Address Updated Successfully',
					description: `Address "${editedAddress.addressNickname}" has been updated successfully.`,
				});
				setDrawerOn(false);
			}
		}
	};

	return (
		<Drawer
			title="Edit Address"
			placement="right"
			closable={false}
			onClose={() => setDrawerOn(false)}
			visible={drawerOn}
			width={screens.xs ? '80vw' : '30vw'}
			forceRender={true}
			destroyOnClose={true}
		>
			<Form layout="vertical" name="newProductForm" form={form} onFinish={editAddress}>
				<Form.Item
					label="Address Nickname"
					name="addressNickname"
					rules={[{ required: true, message: 'Please input your username!' }]}
				>
					<Input
						placeholder="Address Nickname"
						onChange={(e) => setEditedAddress({ ...editedAddress, addressNickname: e.target.value })}
					/>
				</Form.Item>
				<Form.Item
					label="Street Address"
					name="streetAddress"
					rules={[{ required: true, message: 'Please input your username!' }]}
				>
					<Input
						placeholder="Street Address"
						onChange={(e) => setEditedAddress({ ...editedAddress, streetAddress: e.target.value })}
					/>
				</Form.Item>
				<Form.Item
					label="City"
					name="city"
					rules={[{ required: true, message: 'Please input your username!' }]}
				>
					<Input
						placeholder="Street Address"
						onChange={(e) => setEditedAddress({ ...editedAddress, city: e.target.value })}
					/>
				</Form.Item>
				<Form.Item
					label="Postal Code"
					name="postalCode"
					rules={[{ required: true, message: 'Please input your username!' }]}
				>
					<Input
						placeholder="Postal Code"
						onChange={(e) => setEditedAddress({ ...editedAddress, postalCode: e.target.value })}
					/>
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit">
						Edit Address
					</Button>
				</Form.Item>
				<Form.Item>
					<Button onClick={removeAddress}>Remove Address</Button>
				</Form.Item>
			</Form>
		</Drawer>
	);
}
