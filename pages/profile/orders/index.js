import { Typography, Row, Col } from 'antd';
import ProfileLayout from '@pages/profile/ProfileLayout';
import OrderCard from '@pages/profile/orders/orderCard';
import { useUser } from '@/context/userContext';

const { Text, Title } = Typography;

export default function orders() {
	const { user } = useUser();

	return (
		<ProfileLayout>
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
			{user && user.orders && !user.orders.length > 0 && <Title level={5}>You have no orders</Title>}
		</ProfileLayout>
	);
}
