import { useEffect, useState } from 'react';
import firebase from '@/firebase/clientApp';
import { useUser } from '@/context/userContext';
import ProfileLayout from '@pages/profile/ProfileLayout';
import { Form, Input, Row, Col, Space, Button, notification, Typography } from 'antd';
import NumberFormat from 'react-number-format';

const { Text, Title } = Typography;

export default function account() {
	const { loadingUser, user } = useUser();
	const [form] = Form.useForm();
	const [userInfo, setUserInfo] = useState({
		dateModified: firebase.firestore.Timestamp.now(),
	});
	const refProducts = firebase.firestore().collection('users');
	const currentUser = firebase.auth().currentUser;

	useEffect(() => {
		// setEditedAddress(address);
		user &&
			form.setFieldsValue({
				['displayName']: user.displayName,
				['email']: user.email,
				['phoneNumber']: user.phoneNumber,
			});
		return () => {};
	}, [user]);

	const hasChange = () => {
		if (
			form.getFieldsValue().displayName === user.displayName &&
			form.getFieldsValue().email === user.email &&
			form.getFieldsValue().phoneNumber === user.phoneNumber
		)
			return false;
		else return true;
	};

	const editUser = async () => {
		let hasError = null;
		try {
			if (hasChange) {
				await refProducts
					.doc(user.uid)
					.update(userInfo)
					.then(() => {
						currentUser.updateProfile({
							displayName: userInfo.displayName,
							email: userInfo.email,
							phoneNumber: userInfo.phoneNumber,
						});
					});
			}
		} catch (error) {
			notification.error({
				message: 'Error Updating User',
				description: `${error}`,
			});
			console.error(error);
		} finally {
			if (!hasChange()) {
				notification.warning({
					message: 'User Has No Change',
					description: `User "${user.displayName}" has no change to update.`,
				});
			}
			if (!hasError && hasChange()) {
				notification.success({
					message: 'User Updated Successfully',
					description: `User "${user.displayName}" has been updated successfully.`,
				});
			}
		}
	};

	return (
		<ProfileLayout>
			<Row>
				<Col>
					<Title level={3}>Account</Title>
				</Col>
			</Row>
			{user && (
				<Form layout="vertical" name="newProductForm" form={form} onFinish={editUser}>
					<Row justify="end">
						<Col lg={8}>
							<Form.Item
								label="Full Name"
								name="displayName"
								rules={[{ required: true, message: 'Please input your username!' }]}
							>
								<Input
									placeholder="Full Name"
									onChange={(e) => setUserInfo({ ...userInfo, displayName: e.target.value })}
								/>
							</Form.Item>
						</Col>
						<Col lg={8}>
							<Form.Item
								label="Email"
								name="email"
								rules={[{ required: true, message: 'Please input your username!' }]}
							>
								<Input
									placeholder="Email"
									onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
								/>
							</Form.Item>
						</Col>
						<Col lg={8}>
							<Form.Item
								label="Phone Number"
								name="phoneNumber"
								rules={[{ required: true, message: 'Please input your username!' }]}
							>
								<NumberFormat
									customInput={Input}
									format="(###) ###-####"
									mask="_"
									placeholder="Phone Number"
									onChange={(e) => setUserInfo({ ...userInfo, phoneNumber: e.target.value })}
								/>
							</Form.Item>
						</Col>
						<Col>
							<Form.Item>
								<Button type="primary" htmlType="submit">
									Submit
								</Button>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			)}
		</ProfileLayout>
	);
}
