import firebase from '@/firebase/clientApp';
import { useState, useContext } from 'react';
import { useUser } from '@/context/userContext';
import { Grid, Drawer, Avatar, Typography, Form, Input, Button, notification } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { Context } from '@/context/storeContext';

export default function SignInDrawer() {
	const { loadingUser, user } = useUser();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [state, dispatch] = useContext(Context);

	const screens = Grid.useBreakpoint();

	const signInUser = async () => {
		await firebase
			.auth()
			.signInWithEmailAndPassword(email, password)
			.then((res) => {
				dispatch({ type: 'TOGGLE_BOOLEAN', boolean: 'signInDrawerOn' });
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
		dispatch({ type: 'TOGGLE_BOOLEAN', boolean: 'signInDrawerOn' });
		dispatch({ type: 'TOGGLE_BOOLEAN', boolean: 'signUpDrawerOn' });
	};

	// Finishes firebase onAuthStateChanged and didn't find any user
	if (!loadingUser && user === null) {
		return (
			<Drawer
				placement="right"
				closable={false}
				onClose={() => dispatch({ type: 'TOGGLE_BOOLEAN', boolean: 'signInDrawerOn' })}
				visible={state.signInDrawerOn}
				width={screens.xs ? '80vw' : '30vw'}
				style={{ backgroundColor: 'rgba(255, 255, 255, .15)', backdropFilter: 'blur(5px)' }}
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
