import firebase from '@/firebase/clientApp';
import { useState } from 'react';
import { useUser } from '@/context/userContext';
import { Grid, Drawer, Avatar, Typography, Form, Input, Button, notification } from 'antd';
import { LockOutlined } from '@ant-design/icons';

export default function SignInDrawer({ drawerOn, setdrawerOn, setOtherDrawerOn }) {
	const { loadingUser, user } = useUser();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const screens = Grid.useBreakpoint();

	const signInUser = async () => {
		await firebase
			.auth()
			.signInWithEmailAndPassword(email, password)
			.then((res) => {
				setdrawerOn(false);
				notification.success({
					message: 'Signed In Successfully',
					description: `User "${res.user.displayName}" signed in successfully wth the email "${res.user.email}".`,
				});
			})
			.catch((error) => {
				notification.error({
					message: 'Error Logging In',
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

				<Form layout="vertical" onFinish={signInUser}>
					<Form.Item
						label="Email"
						name="email"
						rules={[{ required: true, message: 'Please input your username!' }]}
					>
						<Input
							name="email"
							id="email"
							placeholder="Email Address"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</Form.Item>
					<Form.Item
						label="Password"
						name="password"
						rules={[{ required: true, message: 'Please input your username!' }]}
					>
						<Input
							name="password"
							id="password"
							placeholder="Password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</Form.Item>
					<Button type="primary" htmlType="submit">
						Sign In
					</Button>
					<Button type="link" onClick={toggleDrawers}>
						Don't have an account?
					</Button>
				</Form>
			</Drawer>
		);
		// Finishes firebase onAuthStateChanged and a user is found
	} else {
		return <></>;
	}
}
