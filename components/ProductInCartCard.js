import { Row, Col, Card, Typography, InputNumber, Button } from 'antd';

export default function ProductInCartCard({ productData }) {
	const { Title, Text } = Typography;

	return (
		<Card hoverable style={{ width: '100%', height: 270 }} bodyStyle={{ padding: '0 1rem 1rem 1rem' }}>
			<Row>
				<Col className={'p-2'}>
					<img
						style={{ width: 150, height: 150 }}
						alt="example"
						src={
							productData.images.length
								? productData.images[0].url
								: '/images/600px-No_image_available.png'
						}
					/>
				</Col>
				<Col className={'p-2'}>
					<Text>{productData.title}</Text>
				</Col>
			</Row>
			<Row className={'p-2'}>
				<Col span={8}>
					<Title level={4}>
						{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
							productData.price
						)}
					</Title>
				</Col>
				<Col span={8} offset={8}>
					<InputNumber style={{ width: 56 }} min={1} max={10} defaultValue={1} />
				</Col>
			</Row>
			<Row className={'pt-2'}>
				<Button block color="red-6" type="primary">
					Remove from Cart
				</Button>
			</Row>
		</Card>
	);
}
