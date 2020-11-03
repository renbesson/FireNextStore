import { useRef } from 'react';
import { Grid, Row, Col, Typography, Layout, Carousel, Button, Card } from 'antd';
import ProductCard from '@/components/ProductCard';
import { useCollection } from '@nandorojo/swr-firestore';

const { Title } = Typography;

export default function BestDeals() {
	const screens = Grid.useBreakpoint();

	const { data: products } = useCollection('products', {
		listen: true,
		limit: 10,
	});

	return (
		<Card>
			<Row>
				<Col>
					<Title level={2}>Best Deals</Title>
				</Col>
			</Row>
			<Row>
				<Col>
					{products && (
						<Carousel autoplay autoplaySpeed={2000} slidesToShow={screens.xl ? 4 : 2} arrows dots={false}>
							{products.map((product) => (
								<div key={product.sku}>
									<ProductCard productData={product} />
								</div>
							))}
						</Carousel>
					)}
				</Col>
			</Row>
		</Card>
	);
}
