import { Typography, Button, Row, Col } from 'antd';
import { UserOutlined, BoxPlotOutlined, HeartOutlined, SnippetsOutlined, AimOutlined } from '@ant-design/icons';
import Link from 'next/link';

const MyAccountButtons = () => {
	const buttons = [
		{ title: 'Account', icon: <UserOutlined style={{ fontSize: '2rem' }} />, link: '/myAccount/account' },
		{ title: 'Orders', icon: <BoxPlotOutlined style={{ fontSize: '2rem' }} />, link: '/myAccount/orders' },
		{ title: 'Addresses', icon: <AimOutlined style={{ fontSize: '2rem' }} />, link: '/myAccount/addresses' },
		{ title: 'My Favorites', icon: <HeartOutlined style={{ fontSize: '2rem' }} />, link: '/myAccount/myFavorites' },
		{
			title: 'My Lists',
			icon: <SnippetsOutlined style={{ fontSize: '2rem' }} />,
			link: '/myAccount/myLists',
		},
	];

	return buttons.map((button) => (
		<Row key={button.title}>
			<Col>
				<Link href={button.link}>
					<Button type="link" icon={button.icon} size="large" className={'mb-2'}>
						{button.title}
					</Button>
				</Link>
			</Col>
		</Row>
	));
};

export default function myAccount() {
	return (
		<Row justify="space-between">
			<Col
				xs={24}
				lg={4}
				style={{ minWidth: '250px', borderRight: '2px solid black', borderBottom: '2px solid black' }}
			>
				<Typography.Title className={'mb-3'}>My Account</Typography.Title>
				<MyAccountButtons />
			</Col>
			<Col xs={24} lg={18}>
				<h3>Working in Progress...</h3>
			</Col>
		</Row>
	);
}
