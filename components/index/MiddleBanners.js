import { Row, Col, Card } from 'antd';

const bannerStyle = {
	width: '300px',
	height: '200px',
};

export default function MiddleBanners({ middleBanners }) {
	const MiddleCards = () => {
		return (
			<Row justify="space-around" align="middle">
				{middleBanners.map((banner) => (
					<Col key={banner.fileName}>
						<Card
							bodyStyle={{ padding: 0 }}
							hoverable
							cover={<img src={banner.url} style={bannerStyle} />}
						></Card>
					</Col>
				))}
			</Row>
		);
	};

	return <MiddleCards />;
}
