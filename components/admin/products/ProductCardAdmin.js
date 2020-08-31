import { useState } from 'react';
import { Layout, Row, Col, Card, InputNumber, Button, Typography, Badge } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import EditProductDialog from '@components/admin/products/EditProductDialog';

const { Meta } = Card;
const { Title, Text } = Typography;

export default function ProductCard({ productData }) {
	const [editedProductDrawerOn, setEditedProductDrawerOn] = useState(false);

	return (
		<>
			<EditProductDialog
				drawerOn={editedProductDrawerOn}
				setdrawerOn={setEditedProductDrawerOn}
				productData={productData}
			/>
			<Badge count={'-15%'}>
				<Card
					hoverable
					style={{ width: 200, height: 270 }}
					cover={
						<img
							className={'p-3'}
							style={{ width: 150, height: 150, margin: 'auto' }}
							alt="example"
							src={
								productData.images.length
									? productData.images[0].url
									: '/images/600px-No_image_available.png'
							}
						/>
					}
					bodyStyle={{ padding: '0 1rem 1rem 1rem' }}
					onClick={() => setEditedProductDrawerOn(true)}
				>
					<Row>
						<Text>{productData.name}</Text>
					</Row>
					<Row className={'pt-2'}>
						<Col span={8}>
							<Title level={4}>
								{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
									productData.price
								)}
							</Title>
						</Col>
						<Col span={8} offset={8}></Col>
					</Row>
					<Row className={'pt-2'}>
						<Button block color="red-6" type="primary">
							Adicionar ao carrinho
						</Button>
					</Row>
				</Card>
			</Badge>
		</>
	);
}