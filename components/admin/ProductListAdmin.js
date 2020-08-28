import ProductCard from '@/components/ProductCard';
import { Row, Col } from 'antd';

export default function ProductListAdmin({ products }) {
	return (
		<Row justify="space-around" align="middle" gutter={[16, 16]}>
			{products &&
				products.map((product) => {
					console.log(product);
					return (
						<Col key={product.id}>
							<ProductCard productData={product} />
						</Col>
					);
				})}
		</Row>
	);
}
