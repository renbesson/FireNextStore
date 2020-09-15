import { Layout, Row, Col, Card, InputNumber, Button, Typography, Badge } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function ProductCard({ productData }) {
	return (
		<Badge count={'-15%'}>
			<Card
				hoverable
				style={{ width: 200, height: 270 }}
				cover={
					<img
						className={'p-3'}
						style={{ width: 150, height: 150, margin: 'auto' }}
						alt="example"
						src={productData.images.length ? productData.images[0] : '/images/600px-No_image_available.png'}
					/>
				}
				bodyStyle={{ padding: '0 1rem 1rem 1rem' }}
			>
				<Row>
					<Text>{productData.title}</Text>
				</Row>
				<Row className={'pt-2'}>
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
						Adicionar ao carrinho
					</Button>
				</Row>
			</Card>
		</Badge>
	);
}
