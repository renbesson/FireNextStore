import { Typography, Row, Col } from 'antd';
import MyAccountLayout from '@pages/myAccount/MyAccountLayout';
import OrderCard from '@pages/myAccount/orders/orderCard';
import { useUser } from '@/context/userContext';

const { Text, Title } = Typography;

export default function orders() {
	const { user } = useUser();

	return (
		<MyAccountLayout>
			<Row>
				<Col>
					<Title level={3}>Orders</Title>
				</Col>
			</Row>
			{user &&
				user.orders &&
				user.orders.map((orderData) => (
					<Row justify="end" key={orderData.orderNumber}>
						<Col className={'mb-5'} span={24}>
							<OrderCard orderData={orderData} />
						</Col>
					</Row>
				))}
			{user && user.orders && !user.orders.length > 0 && <Title level={3}>You have no orders</Title>}
		</MyAccountLayout>
	);
}
