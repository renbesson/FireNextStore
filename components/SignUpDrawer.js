import firebase from '@/firebase/clientApp';
import { useState } from 'react';
import { useUser } from '@/context/userContext';
import { Grid, Drawer, Avatar, Typography, Form, Input, Button, notification } from 'antd';
import { LockOutlined } from '@ant-design/icons';

export default function SignInDrawer({ drawerOn, setdrawerOn, setOtherDrawerOn }) {
	const { loadingUser, user } = useUser();
	const [newUser, setNewUser] = useState({
		fName: '',
		lName: '',
		email: '',
		password: '',
	});

	const screens = Grid.useBreakpoint();

	const createUser = async () => {
		await firebase
			.auth()
			.createUserWithEmailAndPassword(newUser.email, newUser.password)
			.then((res) => {
				res.user.updateProfile({
					displayName: `${newUser.fName} ${newUser.lName}`,
				});
				const userObj = {
					uid: res.user.uid,
					email: res.user.email,
					displayName: `${newUser.fName} ${newUser.lName}`,
				};
				firebase.firestore().collection('users').doc(res.user.uid).set(userObj);
				setdrawerOn(false);
				notification.success({
					message: 'Signed Up Successfully',
					description: `User "${newUser.fName} ${newUser.lName}" has been created successfully wth the email "${res.user.email}".`,
				});
			})
			.catch((error) => {
				notification.error({
					message: 'Error Signing Up',
					description: `${error}`,
				});
			});
	};

	const toggleDrawers = () => {
		setdrawerOn(false);
		setOtherDrawerOn(true);
	};

	// Finishes firebase onAuthStateChanged and didn't find any user
	if (!loadingUser && user === null) {
		return (
			<Drawer
				placement="right"
				closable={false}
				onClose={() => setdrawerOn(false)}
				visible={drawerOn}
				width={screens.xs ? '80vw' : '30vw'}
			>
				<Avatar>
					<LockOutlined />
				</Avatar>
				<Typography component="h1" variant="h5">
					Sign in
				</Typography>

				<Form layout="vertical" onFinish={createUser}>
					<Form.Item
						label="First Name"
						name="fName"
						rules={[{ required: true, message: 'Please input your username!' }]}
					>
						<Input
							name="fName"
							id="fName"
							placeholder="First Name"
							value={newUser.fName}
							onChange={(e) => setNewUser({ ...newUser, fName: e.target.value })}
						/>
					</Form.Item>
					<Form.Item
						label="Last Name"
						name="lName"
						rules={[{ required: true, message: 'Please input your username!' }]}
					>
						<Input
							name="lName"
							id="lName"
							placeholder="Last Name"
							value={newUser.lName}
							onChange={(e) => setNewUser({ ...newUser, lName: e.target.value })}
						/>
					</Form.Item>
					<Form.Item
						label="Email"
						name="email"
						rules={[{ required: true, message: 'Please input your email!' }]}
					>
						<Input
							name="email"
							id="email"
							placeholder="Email Address"
							value={newUser.email}
							onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
						/>
					</Form.Item>
					<Form.Item
						label="Password"
						name="password"
						rules={[{ required: true, message: 'Please input your password!' }]}
					>
						<Input
							name="password"
							id="password"
							placeholder="Password"
							type="password"
							value={newUser.password}
							onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
						/>
					</Form.Item>
					<Button type="primary" htmlType="submit">
						Sign Up
					</Button>
					<Button type="link" onClick={toggleDrawers}>
						Already have an account?
					</Button>
				</Form>
			</Drawer>
		);
		// Finishes firebase onAuthStateChanged and a user is found
	} else {
		return <></>;
	}
}