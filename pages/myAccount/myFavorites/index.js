import MyAccountLayout from '@pages/myAccount/MyAccountLayout';
import { Col, Row, Typography } from 'antd';

const { Text, Title } = Typography;

export default function myFavorites() {
	return (
		<MyAccountLayout>
			<Row>
				<Col>
					<Title level={3}>Favorites</Title>
				</Col>
			</Row>
			<h3>Working in Progress on myFavorites...</h3>
		</MyAccountLayout>
	);
}
