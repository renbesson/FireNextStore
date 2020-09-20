import { Typography, Button, Row, Col } from 'antd';
import { UserOutlined, BoxPlotOutlined } from '@ant-design/icons';
import OrderCard from '@pages/myAccount/OrderCard';
import Link from 'next/link';

const orders = [
	{
		orderNumber: 4521323,
		dates: {
			createdOn: { seconds: 1600481670, nanoseconds: 977000000 },
			receivedOn: { seconds: 1600482670, nanoseconds: 977000000 },
			preparedOn: { seconds: 1600489470, nanoseconds: 977000000 },
			outForDeliveryOn: { seconds: 1600483670, nanoseconds: 977000000 },
			deliveredOn: { seconds: 1600484670, nanoseconds: 977000000 },
		},
		status: 'delivered',
		step: 1,
		items: [
			{ title: 'Product 1', price: 0, id: '', imageUrl: '', quantity: 0 },
			{ title: 'Product 2', price: 0, id: '', imageUrl: '', quantity: 0 },
			{ title: 'Product 3', price: 0, id: '', imageUrl: '', quantity: 0 },
		],
		deliveryAddress: { addressName: 'My Home' },
	},
	{
		orderNumber: 7578325,
		dates: {
			createdOn: { seconds: 1600481670, nanoseconds: 977000000 },
			receivedOn: { seconds: 1600482670, nanoseconds: 977000000 },
			preparedOn: { seconds: 1600489470, nanoseconds: 977000000 },
			outForDeliveryOn: { seconds: 1600483670, nanoseconds: 977000000 },
			deliveredOn: { seconds: 1600484670, nanoseconds: 977000000 },
		},
		status: 'canceled',
		step: 3,
		items: [
			{ title: 'Product 1', price: 0, id: '', imageUrl: '', quantity: 0 },
			{ title: 'Product 2', price: 0, id: '', imageUrl: '', quantity: 0 },
			{ title: 'Product 3', price: 0, id: '', imageUrl: '', quantity: 0 },
		],
		deliveryAddress: { addressName: 'My Home' },
	},
	{
		orderNumber: 8531074,
		dates: {
			createdOn: { seconds: 1600481670, nanoseconds: 977000000 },
			receivedOn: { seconds: 1600482670, nanoseconds: 977000000 },
			preparedOn: { seconds: 1600489470, nanoseconds: 977000000 },
			outForDeliveryOn: { seconds: 1600483670, nanoseconds: 977000000 },
			deliveredOn: { seconds: 1600484670, nanoseconds: 977000000 },
		},
		status: 'processing',
		step: 2,
		items: [
			{ title: 'Product 1', price: 0, id: '', imageUrl: '', quantity: 0 },
			{ title: 'Product 2', price: 0, id: '', imageUrl: '', quantity: 0 },
			{ title: 'Product 3', price: 0, id: '', imageUrl: '', quantity: 0 },
		],
		deliveryAddress: { addressName: 'Work' },
	},
];

const MyAccountButtons = () => {
	const buttons = [
		{ title: 'Orders', icon: <BoxPlotOutlined style={{ fontSize: '2rem' }} />, link: '/myAccount/orders' },
		{
			title: 'My Shopping Lists',
			icon: <UserOutlined style={{ fontSize: '2rem' }} />,
			link: '/myAccount/myShoppingLists',
		},
		{ title: 'My Favorites', icon: <UserOutlined style={{ fontSize: '2rem' }} />, link: '/myAccount/myFavorites' },
		{ title: 'Account', icon: <UserOutlined style={{ fontSize: '2rem' }} />, link: '/myAccount/account' },
		{ title: 'Addresses', icon: <UserOutlined style={{ fontSize: '2rem' }} />, link: '/myAccount/addresses' },
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
				{orders.map((orderData) => (
					<Row justify="end" key={orderData.orderNumber}>
						<Col className={'mb-5'} span={24}>
							<OrderCard orderData={orderData} />
						</Col>
					</Row>
				))}
			</Col>
		</Row>
	);
}
