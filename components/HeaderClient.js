import { useState } from 'react';
import firebase from '@/firebase/clientApp';
import { useUser } from '../context/userContext';
import { Grid, Layout, Row, Col, Button, notification, Badge, Menu, Typography } from 'antd';
import SearchBar from '@/components/SearchBar';
import { UserOutlined, HeartOutlined, LogoutOutlined } from '@ant-design/icons';
import { SnippetsOutlined, ShoppingCartOutlined, AppstoreOutlined } from '@ant-design/icons';
import SignInDrawer from '@/components/SignInDrawer';
import SignUpDrawer from '@/components/SignUpDrawer';
import Link from 'next/link';
import SubMenu from 'antd/lib/menu/SubMenu';
import { useDocument } from '@nandorojo/swr-firestore';
import { useRouter } from 'next/router';

const { Text } = Typography;
export default function HeaderClient() {
	const { loadingUser, user } = useUser();
	const [signInDrawerOn, setSignInDrawerOn] = useState(false);
	const [signUpDrawerOn, setSignUpDrawerOn] = useState(false);
	const { data: categories, error } = useDocument('misc/categories');
	const router = useRouter();

	const screens = Grid.useBreakpoint();

	const headerButton = {
		display: 'flex',
		flexDirection: 'column',
		width: '76px',
		lineHeight: '28px',
		cursor: 'pointer',
	};
	const headerButtonIcon = {
		color: '#fff',
		fontSize: '2rem',
	};

	const headerButtonText = { color: '#fff', alignSelf: 'center' };

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

	const SignInUpButton = () => {
		return (
			<div
				style={headerButton}
				onClick={user === null ? () => setSignInDrawerOn(true) : alreadySignedInNotification}
			>
				<UserOutlined style={headerButtonIcon} />
				<Text style={headerButtonText}>Sign In/Up</Text>
			</div>
		);
	};

	const MyAccountButton = () => {
		return (
			<Link href="/myAccount">
				<div style={headerButton} onClick={(value) => console.log(value)}>
					<UserOutlined style={headerButtonIcon} />
					<Text style={headerButtonText}>My Account</Text>
				</div>
			</Link>
		);
	};

	const FavoritesButton = () => {
		return (
			<div style={headerButton} onClick={(value) => console.log(value)}>
				<HeartOutlined style={headerButtonIcon} />
				<Text style={headerButtonText}>Favorites</Text>
			</div>
		);
	};

	const ShoppingListButton = () => {
		return (
			<div style={headerButton} onClick={(value) => console.log(value)}>
				<SnippetsOutlined style={headerButtonIcon} />
				<Text style={headerButtonText}>My Lists</Text>
			</div>
		);
	};

	const CartButton = () => {
		return (
			<Badge
				count={user && user.cart && user.cart.length}
				offset={[-20, 5]}
				style={{ backgroundColor: '#52c41a' }}
			>
				<Link href="/cart">
					<div style={headerButton} onClick={(value) => console.log(value)}>
						<ShoppingCartOutlined style={headerButtonIcon} />
						<Text style={headerButtonText}>Cart</Text>
					</div>
				</Link>
			</Badge>
		);
	};

	const SignOutButton = () => {
		return (
			<div style={headerButton} onClick={onSignOut}>
				<LogoutOutlined style={headerButtonIcon} />
				<Text style={headerButtonText}>Sign Out</Text>
			</div>
		);
	};

	return (
		<>
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
			<Row className={'px-3'} justify="space-between" align="middle">
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
				<Col>{!loadingUser && user === null ? <SignInUpButton /> : null}</Col>
				<Col>{!loadingUser && user ? <MyAccountButton /> : null}</Col>
				<Col>
					<CartButton />
				</Col>
				<Col>
					<FavoritesButton />
				</Col>
				<Col>
					<ShoppingListButton />
				</Col>
				<Col>{!loadingUser && user ? <SignOutButton /> : null}</Col>
			</Row>
			<Row
				justify="space-around"
				style={{ backgroundColor: '#fff', borderTop: '1px solid gray', borderBottom: '1px solid gray' }}
			>
				<Col>
					<Menu
						mode="horizontal"
						onClick={({ key }) => router.push(`/pd/search/${key}?sField=category&oField=price&orderBy=asc`)}
					>
						<SubMenu key="sub2" icon={<AppstoreOutlined />} title="Categories">
							{categories &&
								Object.keys(categories)
									.sort()
									.map((categoryLevel1) => {
										//If statement prevents to map the variables id, exists, and hasPendingWrites.
										if (categories[categoryLevel1] instanceof Object) {
											return (
												<SubMenu key={categoryLevel1} title={categoryLevel1}>
													{Object.keys(categories[categoryLevel1])
														.sort()
														.map((categoryLevel2) => {
															return (
																<SubMenu key={categoryLevel2} title={categoryLevel2}>
																	{categories[categoryLevel1][categoryLevel2]
																		.sort()
																		.map((item) => {
																			return (
																				<Menu.Item key={item}>{item}</Menu.Item>
																			);
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
				<Col>
					<Button type="link">Nossa Loja</Button>
				</Col>
				<Col>
					<Button type="link">Fale Pelo Zap</Button>
				</Col>
				<Col>
					<Button type="link">Encarte</Button>
				</Col>
				<Col>
					<Button type="link" style={{ fontWeight: 'bold', color: 'blue' }}>
						Ofertas do Dia!
					</Button>
				</Col>
			</Row>
		</>
	);
}
