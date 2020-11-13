import { Row, Col, Card, Typography, Grid, Button, Divider, Steps, List } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import Avatar from 'antd/lib/avatar/avatar';
import Link from 'next/link';
import { useShoppingCart } from 'use-shopping-cart';
import firebase from '@/firebase/clientApp';

const { Title, Text } = Typography;
const { Step } = Steps;

export default function OrderCard({ orderData }) {
	const screens = Grid.useBreakpoint();
	const { redirectToCheckout } = useShoppingCart();
	const [statsColorValue, setStatsColorValue] = useState('rgba(127, 127, 127)');
	const [showItems, setShowItems] = useState(false);
	const getSessionObj = firebase.functions().httpsCallable('retrieveStripeSession');
	const cancelOrder = firebase.functions().httpsCallable('cancelOrder');
	const [sessionObj, setSessionObj] = useState({});

	useEffect(() => {
		if (orderData.dates.cancelledOn) setStatsColorValue('rgba(240, 50, 50)');
		else if (orderData.dates.deliveredOn) setStatsColorValue('rgba(35, 200, 100)');
		else setStatsColorValue('rgba(255, 192, 0)');
		return () => {};
	}, [orderData]);

	useEffect(() => {
		getSessionObj({ sessionId: orderData.sessionId }).then((result) => {
			setSessionObj(result.data);
		});
	}, [orderData, orderData.sessionId]);

	return (
		<Card
			style={{ width: '100%', borderLeft: '10px solid', borderColor: statsColorValue }}
			bodyStyle={{ padding: '1rem' }}
		>
			<Row justify="space-between">
				<Col>
					<Title level={3}>{`Order #${orderData.id}`}</Title>
				</Col>
				<Col>
					{sessionObj.payment_status === 'paid' && (
						<Title level={3} className={'capitalize'}>
							paid
						</Title>
					)}
					{sessionObj.payment_status === 'unpaid' && orderData.dates.cancelledOn === null && (
						<Title
							level={3}
							className={'capitalize'}
							style={{ cursor: 'pointer', color: 'red' }}
							onClick={() =>
								redirectToCheckout({ sessionId: orderData.sessionId }).then(function (result) {
									console.log(`SessionIDError: ${result}`);
									result.error.message;
								})
							}
						>
							unpaid '(Click Here To Pay)'
						</Title>
					)}
					{sessionObj.payment_status === 'unpaid' && orderData.dates.cancelledOn && (
						<Title level={3} className={'capitalize'} style={{ color: 'red' }}>
							Cancelled
						</Title>
					)}
				</Col>
			</Row>
			<Row justify="space-between">
				<Col>{`Date: ${orderData.dates.receivedOn.toDate().toLocaleString('en-US')}`}</Col>
				{sessionObj.payment_status === 'unpaid' && orderData.dates.cancelledOn === null && (
					<Col>
						<Button onClick={() => cancelOrder({ orderId: orderData.id })}>
							Cancel Order
						</Button>
					</Col>
				)}
			</Row>
			<Divider />
			<Row>
				<Col className={'p-2'}>
					<ShoppingCartOutlined style={{ fontSize: '4rem' }} />
				</Col>
				<Col className={'p-2'}>
					<Row>
						<Col>
							<Text>{`To: ${orderData.deliveryAddress.streetAddress}, ${orderData.deliveryAddress.city}, ${orderData.deliveryAddress.postalCode} (${orderData.deliveryAddress.addressNickname})`}</Text>
						</Col>
					</Row>
					<Row>
						<Col>
							<Text strong>
								{`${orderData.items.length} Itens - Total
									${new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(
										orderData.items.reduce((total, item) => item.priceCurrent + total, 0)
									)}`}
							</Text>
						</Col>
					</Row>
				</Col>
			</Row>
			<Row justify="center">
				<Col span={24}>
					<Steps current={orderData.step} progressDot direction={screens.xs ? 'vertical' : 'horizontal'}>
						<Step
							title="Order Received"
							description={
								orderData.dates.receivedOn &&
								orderData.dates.receivedOn.toDate().toLocaleString('en-US')
							}
						/>
						<Step
							title="Preparing"
							description={
								orderData.dates.preparedOn &&
								orderData.dates.preparedOn.toDate().toLocaleString('en-US')
							}
						/>
						<Step
							title="Out For Delivery"
							description={
								orderData.dates.outForDeliveryOn &&
								orderData.dates.outForDeliveryOn.toDate().toLocaleString('en-US')
							}
						/>
						<Step
							title="Delivered"
							description={
								orderData.dates.deliveredOn &&
								orderData.dates.deliveredOn.toDate().toLocaleString('en-US')
							}
						/>
					</Steps>
				</Col>
			</Row>
			<Row className={'pt-2'} justify="center">
				{!showItems && (
					<Col>
						<Button type="link" size="large" onClick={() => setShowItems(true)}>
							Order Details
						</Button>
					</Col>
				)}
				{showItems && (
					<Col span={24}>
						<List
							itemLayout="horizontal"
							dataSource={orderData.items}
							renderItem={(item) => (
								<List.Item>
									<List.Item.Meta
										avatar={<Avatar src={item.imageUrl} />}
										title={
											<Link href={`/pd/${item.sku}`}>
												<a>{item.name}</a>
											</Link>
										}
										description={`Quantity: ${item.quantity} | Price: ${new Intl.NumberFormat(
											'en-CA',
											{
												style: 'currency',
												currency: 'CAD',
											}
										).format(item.priceCurrent)}`}
									/>
								</List.Item>
							)}
						/>
					</Col>
				)}
			</Row>
			<style global jsx>
				{`
					.capitalize {
						text-transform: capitalize;
					}
				`}
			</style>
		</Card>
	);
}
