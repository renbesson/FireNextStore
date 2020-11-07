import { useState } from 'react';
import { Row, Col, Card, Typography, Badge } from 'antd';
import EditProductDrawer from '@pages/admin/products/EditProductDrawer';

const { Title, Text, Paragraph } = Typography;

export default function ProductCard({ productData }) {
	const [editedProductDrawerOn, setEditedProductDrawerOn] = useState(false);

	const calcPercentageDiff = (baseVal, currentVal) => {
		const diff = baseVal - currentVal;
		const percentage = (diff / baseVal) * 100;
		return percentage;
	};

	return (
		<>
			<EditProductDrawer
				drawerOn={editedProductDrawerOn}
				setdrawerOn={setEditedProductDrawerOn}
				productData={productData}
			/>
			<Badge
				style={{
					width: '35px',
					height: '35px',
					fontWeight: 'bold',
					borderRadius: '35px',
					lineHeight: '35px',
					paddingLeft: '3px',
				}}
				count={`-${parseInt(
					((productData.priceBase - productData.priceCurrent) / productData.priceBase) * 100
				)}%`}
			>
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
						<Paragraph ellipsis={{ rows: 2 }}>{productData.name}</Paragraph>
					</Row>
					<Row className={'pt-2'}>
						<Col>
							<Title level={4}>
								{new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(
									productData.priceCurrent
								)}
							</Title>
						</Col>
						<Col span={8} offset={8}></Col>
					</Row>
				</Card>
			</Badge>
		</>
	);
}
