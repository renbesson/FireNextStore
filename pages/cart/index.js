import { useUser } from '@/context/userContext';
import ProductInCartCard from '@pages/cart/ProductInCartCard';
import { Row, Col, Card, Typography } from 'antd';
import Summary from './Summary';
import { useCollection } from '@nandorojo/swr-firestore';

const { Title } = Typography;

export default function cart() {
	const { user } = useUser();
	const pids = user && user.cart ? user.cart.map(({ pid }) => pid) : undefined;
	const { data: products, error } = useCollection(pids ? 'products' : null, {
		listen: true,
		where: [['pid', 'in', pids]],
	});

	return (
		<Row justify="space-between">
			<Col xs={24} lg={16}>
				<Row align="middle" gutter={[24, 24]}>
					{products &&
						products.map((product) => {
							// The if statement prevent a console error since the product is first created and after is injected the id in the firebase document.
							if (product.pid) {
								return (
									<Col span={24} key={product.pid}>
										<ProductInCartCard productData={product} user={user} />
									</Col>
								);
							} else return;
						})}
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
