import { Typography, Row, Col, Collapse } from 'antd';
import ProfileLayout from '@pages/profile/ProfileLayout';
import OrderCard from '@pages/profile/orders/orderCard';
import { useUser } from '@/context/userContext';
import { useCollection } from '@nandorojo/swr-firestore';

const { Text, Title } = Typography;
const { Panel } = Collapse;

export default function orders() {
	const { user } = useUser();
	const { data: orders, error } = useCollection('orders', {
		listen: true,
		where: [['owner', '==', user && user.uid]],
	});

	return (
		<ProfileLayout>
			<Row>
				<Col>
					<Title level={3}>Orders</Title>
				</Col>
			</Row>
			{orders &&
				orders.map((orderData) => (
					<Row key={orderData.id}>
						<Col className={'my-3'} span={24}>
							<OrderCard orderData={orderData} />
						</Col>
					</Row>
				))}
			{user && user.orders && !user.orders.length > 0 && <Title level={5}>You have no orders</Title>}
		</ProfileLayout>
	);
}
