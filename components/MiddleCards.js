import { Row, Col, Card } from 'antd';

const banner = {
	width: '300px',
	height: '200px',
};

export default function MiddleCards() {
	return (
		<Row justify="space-around" align="middle">
			<Col>
				<Card bodyStyle={{padding: 0}} hoverable cover={<img src="/images/banner1.png" style={banner} />}></Card>
			</Col>
            <Col>
				<Card bodyStyle={{padding: 0}} hoverable cover={<img src="/images/banner2.png" style={banner} />}></Card>
			</Col>
            <Col>
				<Card bodyStyle={{padding: 0}} hoverable cover={<img src="/images/banner3.png" style={banner} />}></Card>
			</Col>
		</Row>
	);
}
