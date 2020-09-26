import { useState } from 'react';
import firebase from '@/firebase/clientApp';
import { useUser } from '../context/userContext';
import { Grid, Layout, Row, Col, Button, notification, Badge, Menu } from 'antd';
import SearchBar from '@/components/SearchBar';
import { UserOutlined, HeartOutlined } from '@ant-design/icons';
import { SnippetsOutlined, ShoppingCartOutlined, AppstoreOutlined } from '@ant-design/icons';
import SignInDrawer from '@/components/SignInDrawer';
import SignUpDrawer from '@/components/SignUpDrawer';
import Link from 'next/link';
import SubMenu from 'antd/lib/menu/SubMenu';
import { useDocument } from '@nandorojo/swr-firestore';
import { useRouter } from 'next/router';

const { Header } = Layout;

export default function HeaderClient() {
	const { loadingUser, user } = useUser();
	const [signInDrawerOn, setSignInDrawerOn] = useState(false);
	const [signUpDrawerOn, setSignUpDrawerOn] = useState(false);
	const { data: categories, error } = useDocument('misc/categories');
	const router = useRouter();

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
				minHeight: screens.xs ? '25vh' : '15vh',
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
			<Row>
				<Col>
					<Menu
						mode="horizontal"
						onClick={({ key }) => router.push(`/pd/search/${key}?sField=category&oField=price&orderBy=asc`)}
					>
						<SubMenu key="sub2" icon={<AppstoreOutlined />} title="Categories">
							{categories &&
								Object.keys(categories).map((categoryLevel1) => {
									//If statement prevents to map the variables id, exists, and hasPendingWrites.
									if (categories[categoryLevel1] instanceof Object) {
										return (
											<SubMenu key={categoryLevel1} title={categoryLevel1}>
												{Object.keys(categories[categoryLevel1]).map((categoryLevel2) => {
													return (
														<SubMenu key={categoryLevel2} title={categoryLevel2}>
															{categories[categoryLevel1][categoryLevel2].map((item) => {
																return <Menu.Item key={item}>{item}</Menu.Item>;
															})}
														</SubMenu>
													);
												})}
											</SubMenu>
										);
									}
								})}
						</SubMenu>
					</Menu>
				</Col>
			</Row>
		</Header>
	);
}
