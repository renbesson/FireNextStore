import { useState } from 'react';
import ProductCardAdmin from '@pages/admin/products/ProductCardAdmin';
import NewProductDrawer from '@pages/admin/products/NewProductDrawer';
import { Row, Col, Card } from 'antd';
import { PlusCircleTwoTone } from '@ant-design/icons';

export default function ProductListAdmin({ products }) {
	const [newProductDrawerOn, setNewProductDrawerOn] = useState(false);

	return (
		<>
			<NewProductDrawer drawerOn={newProductDrawerOn} setdrawerOn={setNewProductDrawerOn} />
			<Row align="middle" gutter={[24, 24]}>
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
					products.map((product) => (
						<Col key={product.sku}>
							<ProductCardAdmin productData={product} />
						</Col>
					))}
			</Row>
		</>
	);
}
