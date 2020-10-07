import { Typography, Row, Col } from 'antd';
import MyAccountLayout from '@pages/myAccount/MyAccountLayout';
import OrderCard from '@pages/myAccount/OrderCard';
import { useUser } from '@/context/userContext';

const { Title } = Typography;

export default function orders() {
	const { user } = useUser();

	return (
		<MyAccountLayout>
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
