import { useState } from 'react';
import ProductCardAdmin from '@components/admin/products/ProductCardAdmin';
import NewProductDialog from '@components/admin/products/NewProductDialog';
import { Row, Col, Card, Typography, InputNumber, Button } from 'antd';
import { PlusCircleTwoTone } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function ProductListAdmin({ products }) {
	const [newProductDrawerOn, setNewProductDrawerOn] = useState(false);

	return (
		<>
			<NewProductDialog drawerOn={newProductDrawerOn} setdrawerOn={setNewProductDrawerOn} />
			<Row justify="space-around" align="middle" gutter={[16, 16]}>
				<Col>
					<Card
						hoverable
						style={{ width: 200, height: 270 }}
						cover={
							<PlusCircleTwoTone
								style={{ fontSize: '10rem', margin: 'auto', paddingTop: '50px' }}
								twoToneColor="#ec3237"
							/>
						}
						bodyStyle={{ padding: '0 1rem 1rem 1rem' }}
						onClick={() => setNewProductDrawerOn(true)}
					></Card>
				</Col>
				{products &&
					products.map((product) => {
						return (
							<Col key={product.id}>
								<ProductCardAdmin productData={product} />
							</Col>
						);
					})}
			</Row>
		</>
	);
}
