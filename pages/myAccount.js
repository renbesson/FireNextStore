import { Typography, Button, Row, Col } from 'antd';
import { UserOutlined, BoxPlotOutlined } from '@ant-design/icons';
import OrderCard from '@components/OrderCard';

const orders = [
	{
		orderNumber: 4521323,
		dateCreated: '',
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
		dateCreated: '',
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
		dateCreated: '',
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
		{ title: 'Orders', icon: <BoxPlotOutlined style={{ fontSize: '2rem' }} /> },
		{ title: 'My Shopping Lists', icon: <UserOutlined style={{ fontSize: '2rem' }} /> },
		{ title: 'My Favotives', icon: <UserOutlined style={{ fontSize: '2rem' }} /> },
		{ title: 'Account', icon: <UserOutlined style={{ fontSize: '2rem' }} /> },
		{ title: 'Addresses', icon: <UserOutlined style={{ fontSize: '2rem' }} /> },
	];
	return buttons.map((button) => (
		<Row key={button.title}>
			<Col>
				<Button type="link" icon={button.icon} size="large" className={'mb-2'}>
					{button.title}
				</Button>
			</Col>
		</Row>
	));
};

export default function myAccount() {
	return (
		<Row>
			<Col
				xs={24}
				lg={4}
				style={{ minWidth: '250px', borderRight: '2px solid black', borderBottom: '2px solid black' }}
			>
				<Typography.Title className={'mb-3'}>My Account</Typography.Title>
				<MyAccountButtons />
			</Col>
			<Col xs={24} lg={17} offset={1}>
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
