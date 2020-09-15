import { Typography, Button, Row, Col } from 'antd';
import { UserOutlined, BoxPlotOutlined } from '@ant-design/icons';

const MyAccountButtons = () => {
	const buttons = [
		{ title: 'Orders', icon: <BoxPlotOutlined style={{ fontSize: '2rem' }} /> },
		{ title: 'Account', icon: <UserOutlined style={{ fontSize: '2rem' }} /> },
	];
	return buttons.map((button) => (
		<Row key={button.title}>
			<Col>
				<Button type="text" icon={button.icon}>
					{button.title}
				</Button>
			</Col>
		</Row>
	));
};

export default function myAccount() {
	return (
		<Row>
			<Col lg={5} style={{ borderRight: '2px solid black', borderBottom: '2px solid black' }}>
				<Typography.Title>My Account</Typography.Title>
				<MyAccountButtons />
			</Col>
		</Row>
	);
}
