import { Row, Col, Card, Typography, Grid, Button, Divider, Steps, List } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import Avatar from 'antd/lib/avatar/avatar';
import Link from 'next/link';

const { Title, Text } = Typography;
const { Step } = Steps;

export default function OrderCard({ orderData }) {
	const screens = Grid.useBreakpoint();
	const [statsColorValue, setStatsColorValue] = useState('rgba(127, 127, 127)');
	const [showItems, setShowItems] = useState(false);

	useEffect(() => {
		switch (orderData.status) {
			case 'canceled':
				setStatsColorValue('rgba(240, 50, 50)');
				break;
			case 'processing':
				setStatsColorValue('rgba(255, 192, 0)');
				break;
			case 'delivered':
				setStatsColorValue('rgba(35, 200, 100)');
				break;
			default:
				setStatsColorValue('rgba(0, 0, 0)');
				break;
		}
		return () => {};
	}, [orderData && orderData.status]);

	return (
		<Card
			hoverable
			style={{ width: '100%', borderLeft: '10px solid', borderColor: statsColorValue }}
			bodyStyle={{ padding: '0 1rem 1rem 1rem' }}
		>
			<Row justify="space-between">
				<Col>
					<Title level={3}>{`Order #${orderData.orderNumber}`}</Title>
				</Col>
				<Col>
					<Title level={3} className={'capitalize'}>
						{orderData.status}
					</Title>
				</Col>
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
										orderData.items.reduce((total, item) => item.price + total, 0)
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
							// description={orderData.dates.receivedOn.toDate().toLocaleString('en-US')}
						/>
						<Step
							title="Preparing"
							// description={orderData.dates.preparedOn.toDate().toLocaleString('en-US')}
						/>
						<Step
							title="Out For Delivery"
							// description={orderData.dates.outForDeliveryOn.toDate().toLocaleString('en-US')}
						/>
						<Step
							title="Delivered"
							// description={orderData.dates.deliveredOn.toDate().toLocaleString('en-US')}
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
											<Link href={`/pd/${item.pid}`}>
												<a>{item.title}</a>
											</Link>
										}
										description={`Quantity: ${item.quantity} | Price: ${new Intl.NumberFormat(
											'en-CA',
											{
												style: 'currency',
												currency: 'CAD',
											}
										).format(item.price)}`}
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