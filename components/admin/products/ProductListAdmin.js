import { useState } from 'react';
import ProductCardAdmin from '@components/admin/products/ProductCardAdmin';
import NewProductDialog from '@components/admin/products/NewProductDialog';
import { Row, Col, Card } from 'antd';
import { PlusCircleTwoTone } from '@ant-design/icons';

export default function ProductListAdmin({ products }) {
	const [newProductDrawerOn, setNewProductDrawerOn] = useState(false);

	return (
		<>
			<NewProductDialog drawerOn={newProductDrawerOn} setdrawerOn={setNewProductDrawerOn} />
			<Row align="middle" gutter={[24, 24]}>
				<Col>
					{products.length && (
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
					)}
				</Col>
				{products &&
					products.map((product) => {
						// The if statement prevent a console error since the product is first created and after is injected the id in the firebase document.
						if (product.pid) {
							return (
								<Col key={product.pid}>
									<ProductCardAdmin productData={product} />
								</Col>
							);
						} else return;
					})}
			</Row>
		</>
	);
}
