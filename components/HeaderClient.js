import { useContext } from 'react';
import firebase from '@/firebase/clientApp';
import { useUser } from '../context/userContext';
import { Grid, Row, Col, notification, Badge, Menu, Typography, Image } from 'antd';
import SearchBar from '@/components/SearchBar';
import { UserOutlined, HeartOutlined } from '@ant-design/icons';
import { SnippetsOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import SignInDrawer from '@/components/SignInDrawer';
import SignUpDrawer from '@/components/SignUpDrawer';
import NewAddressDrawer from '@pages/profile/addresses/NewAddressDrawer';
import { useRouter } from 'next/router';
import { Context } from '@/context/storeContext';
import { useShoppingCart } from 'use-shopping-cart';

const { Text } = Typography;
const { SubMenu } = Menu;

export default function HeaderClient() {
	const { loadingUser, user } = useUser();
	const router = useRouter();
	const [state, dispatch] = useContext(Context);
	const { cartCount, cartDetails } = useShoppingCart();

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

	// ++ Buttons --
	const SignInUpButton = (
		<Menu theme="dark" mode="horizontal">
			<Menu.Item
				key="0"
				onClick={
					user === null
						? () => dispatch({ type: 'TOGGLE_BOOLEAN', boolean: 'signInDrawerOn' })
						: alreadySignedInNotification
				}
				icon={<UserOutlined style={headerButtonIcon} />}
			>
				Sign In/Up
			</Menu.Item>
		</Menu>
	);

	const ProfileButton = (
		<Menu theme="dark" mode="horizontal">
			<SubMenu key="SubMenu" icon={<UserOutlined style={headerButtonIcon} />} title={user && user.displayName}>
				<Menu.Item key="1" onClick={() => router.push('/profile/account')}>
					Account
				</Menu.Item>
				<Menu.Item key="2" onClick={() => router.push('/profile/orders')}>
					Orders
				</Menu.Item>
				<Menu.Item key="3" onClick={() => router.push('/profile/addresses')}>
					Addresses
				</Menu.Item>
				<Menu.Item key="4" onClick={onSignOut}>
					Sigh Out
				</Menu.Item>
			</SubMenu>
		</Menu>
	);

	const CartButton = (
		<Badge count={cartCount} offset={[-20, 5]} style={{ backgroundColor: '#52c41a' }}>
			<div style={headerButton} onClick={() => router.push('/cart')}>
				<ShoppingCartOutlined style={headerButtonIcon} />
				<Text style={headerButtonText}>Cart</Text>
			</div>
		</Badge>
	);

	const FavoritesButton = (
		<div style={headerButton} onClick={(value) => console.log(value)}>
			<HeartOutlined style={headerButtonIcon} />
			<Text style={headerButtonText}>Favorites</Text>
		</div>
	);

	const ShoppingListButton = (
		<div style={headerButton} onClick={(value) => console.log(value)}>
			<SnippetsOutlined style={headerButtonIcon} />
			<Text style={headerButtonText}>My Lists</Text>
		</div>
	);

	// -- Buttons ++

	const Buttons = () => {
		if (!user && !loadingUser)
			return (
				<>
					{SignInUpButton}
					{CartButton}
				</>
			);
		else if (user && !loadingUser)
			return (
				<>
					{ProfileButton}
					{CartButton}
					{FavoritesButton}
					{ShoppingListButton}
				</>
			);
		else return <></>;
	};

	return (
		<>
			<SignInDrawer />
			<SignUpDrawer />
			<NewAddressDrawer />
			<Row align="bottom">
				<Col xl={5}>
					<Image
						width={100}
						style={{ cursor: 'pointer' }}
						alt="Logo"
						src="/images/logo.png"
						preview={false}
						onClick={() => router.push('/')}
					/>
				</Col>
				<Col xl={10}>
					<SearchBar />
				</Col>
				<Col xl={9} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
					<Buttons />
				</Col>
			</Row>
		</>
	);
}
