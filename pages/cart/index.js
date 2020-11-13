import { useUser } from '@/context/userContext';
import ProductInCartCard from '@/components/cart/ProductInCartCard';
import { Row, Col, Card, Typography } from 'antd';
import Summary from '@/components/cart/Summary';
import { useCollection } from '@nandorojo/swr-firestore';
import { useShoppingCart } from 'use-shopping-cart';

const { Title } = Typography;

export default function cart() {
	const { cartDetails } = useShoppingCart();
	const { user } = useUser();
	const skus = cartDetails ? Object.keys(cartDetails) : undefined;
	const { data: products, error } = useCollection(skus ? 'products' : null, {
		listen: true,
		where: [['sku', 'in', skus]],
	});

	return (
		<Row justify="space-between">
			<Col xs={24} lg={16}>
				<Row align="middle" gutter={[24, 24]}>
					{products &&
						products.map((product) => (
							<Col span={24} key={product.sku}>
								<ProductInCartCard productData={product} user={user} />
							</Col>
						))}
				</Row>
				{!products && (
					<Col span={24}>
						<Title level={3}>Cart Is Empty</Title>
					</Col>
				)}
			</Col>
			<Col xs={24} lg={7}>
				<Summary productsData={products} user={user} />
			</Col>
		</Row>
	);
}
