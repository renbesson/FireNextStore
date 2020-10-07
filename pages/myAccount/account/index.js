import { useEffect, useState } from 'react';
import firebase from '@/firebase/clientApp';
import { useUser } from '@/context/userContext';
import MyAccountLayout from '@pages/myAccount/MyAccountLayout';
import { Form, Input, Row, Col, Space, Button, notification } from 'antd';
import NumberFormat from 'react-number-format';

export default function account() {
	const { loadingUser, user } = useUser();
	const [form] = Form.useForm();
	const [userInfo, setUserInfo] = useState({
		dateModified: firebase.firestore.Timestamp.now(),
	});

	const editUser = async () => {
		let hasError = null;
		try {
			const refProducts = firebase.firestore().collection('users');
			const currentUser = firebase.auth().currentUser;
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
		} catch (error) {
			notification.error({
				message: 'Error Updating User',
				description: `${error}`,
			});
			console.error(error);
			hasError = true;
		} finally {
			if (!hasError) {
				form.resetFields();
				notification.success({
					message: 'User Updated Successfully',
					description: `User "${user.displayName}" has been updated successfully.`,
				});
			}
		}
	};

	return (
		<MyAccountLayout>
			{user && (
				<Form
					layout="vertical"
					name="newProductForm"
					form={form}
					onFinish={editUser}
					initialValues={{
						['displayName']: user ? user.displayName : '',
						['email']: user ? user.email : '',
						['phoneNumber']: user ? user.phoneNumber : '',
					}}
				>
					<Row justify="end">
						<Col lg={8}>
							<Form.Item
								label="Full Name"
								name="displayName"
								rules={[{ required: true, message: 'Please input your username!' }]}
							>
								<Input
									placeholder="Full Name"
									// value={userInfo.displayName ? userInfo.displayName : user && user.displayName}
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
									// value={userInfo.email}
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
									// value={userInfo.phoneNumber}
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
		</MyAccountLayout>
	);
}
