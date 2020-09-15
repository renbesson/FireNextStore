import { useState } from 'react';
import firebase from '@/firebase/clientApp';
import { useUser } from '../context/userContext';
import { Grid, Layout, Row, Col, Card, Image, InputNumber, Button, notification, Badge } from 'antd';
import SearchBar from '@/components/SearchBar';
import { UserOutlined, HeartOutlined, SnippetsOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import SignInDrawer from '@/components/SignInDrawer';
import SignUpDrawer from '@/components/SignUpDrawer';
import Link from 'next/link';

const { Header } = Layout;

export default function HeaderClient() {
	const { loadingUser, user } = useUser();
	const [signInDrawerOn, setSignInDrawerOn] = useState(false);
	const [signUpDrawerOn, setSignUpDrawerOn] = useState(false);

	const screens = Grid.useBreakpoint();

	const SignInUpButton = () => {
		return (
			<Button
				style={{ color: '#ffffff', fontSize: '0.75rem' }}
				type="text"
				icon={<UserOutlined style={{ color: '#ffffff', fontSize: '2rem' }} />}
				onClick={user === null ? () => setSignInDrawerOn(true) : alreadySignedInNotification}
			>
				Sign In/ Sign Up
			</Button>
		);
	};

	const MyAccountButton = () => {
		return (
			<Link href="/myAccount">
				<Button
					style={{ color: '#ffffff', fontSize: '0.75rem' }}
					type="text"
					icon={<UserOutlined style={{ color: '#ffffff', fontSize: '2rem' }} />}
				>
					My Account
				</Button>
			</Link>
		);
	};

	const FavoritesButton = () => {
		return (
			<Button
				style={{ color: '#ffffff', fontSize: '0.75rem' }}
				type="text"
				icon={<HeartOutlined style={{ color: '#ffffff', fontSize: '2rem' }} />}
			>
				Favorites
			</Button>
		);
	};

	const ShoppingListButton = () => {
		return (
			<Button
				style={{ color: '#ffffff', fontSize: '0.75rem' }}
				type="text"
				icon={<SnippetsOutlined style={{ color: '#ffffff', fontSize: '2rem' }} />}
			>
				Shopping Lists
			</Button>
		);
	};

	const CartButton = () => {
		return (
			<Badge
				count={user && user.cart && user.cart.length}
				offset={[-43, 10]}
				style={{ backgroundColor: '#52c41a' }}
			>
				<Link href="/cart">
					<Button
						style={{ color: '#ffffff', fontSize: '0.75rem' }}
						type="text"
						icon={<ShoppingCartOutlined style={{ color: '#ffffff', fontSize: '2rem' }} />}
					>
						Cart
					</Button>
				</Link>
			</Badge>
		);
	};

	const SignOutButton = () => {
		return (
			<Button
				style={{ color: '#ffffff', fontSize: '0.75rem' }}
				type="text"
				icon={<ShoppingCartOutlined style={{ color: '#ffffff', fontSize: '2rem' }} />}
				onClick={onSignOut}
			>
				Sign Out
			</Button>
		);
	};

	const onSignOut = () => {
		firebase
			.auth()
			.signOut()
			.then(() => {
				// Sign-out successful.
				notification.success({
					message: 'Signed Out',
					description: `Signed out successfully.`,
				});
			})
			.catch((e) => {
				console.error(e);
			});
	};

	const alreadySignedInNotification = () => {
		notification.open({
			message: 'Already Signed In',
			description: `You are already signed in with the email "${user.email}".`,
		});
	};

	return (
		<Header
			style={{
				margin: 'auto',
				width: screens.xs ? '100vw' : '95vw',
				maxWidth: '1200px',
				minHeight: screens.xs ? '25vh' : '10vh',
			}}
		>
			<SignInDrawer
				drawerOn={signInDrawerOn}
				setdrawerOn={setSignInDrawerOn}
				setOtherDrawerOn={setSignUpDrawerOn}
			/>
			<SignUpDrawer
				drawerOn={signUpDrawerOn}
				setdrawerOn={setSignUpDrawerOn}
				setOtherDrawerOn={setSignInDrawerOn}
			/>
			<Row justify="space-between" align="middle">
				<Col span={3}>
					<Link href="/">
						<img
							style={{ minHeight: '48px', height: '10vh', padding: '10px', cursor: 'pointer' }}
							alt="Logo"
							src="/images/logo.png"
						/>
					</Link>
				</Col>
				<Col xs={24} lg={8}>
					<SearchBar />
				</Col>
				<Col>
					{!loadingUser && user === null ? <SignInUpButton /> : null}
					{!loadingUser && user ? <MyAccountButton /> : null}
					<FavoritesButton />
					<ShoppingListButton />
					<CartButton />
					{!loadingUser && user ? <SignOutButton /> : null}
				</Col>
			</Row>
		</Header>
	);
}
