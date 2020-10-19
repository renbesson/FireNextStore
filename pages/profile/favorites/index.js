import { useCollection } from '@nandorojo/swr-firestore';
import ProfileLayout from '@pages/profile/ProfileLayout';
import { Col, Row, Typography } from 'antd';
import { useUser } from '@/context/userContext';
import ProductCard from '@components/ProductCard';

const { Text, Title } = Typography;

export default function favorites() {
	const { user } = useUser();

	const { data: products } = useCollection('products', {
		listen: true,
		where: ['pid', 'in', user && user.favorites],
	});

	const ProductsList = () => {
		return products.map((product) => {
			return (
				<Col key={product.pid}>
					<ProductCard productData={product} />
				</Col>
			);
		});
	};

	return (
		<ProfileLayout>
			<Row>
				<Col>
					<Title level={3}>Favorites</Title>
				</Col>
			</Row>
			<Row align="middle" gutter={[24, 24]}>
				{products && <ProductsList />}
			</Row>
		</ProfileLayout>
	);
}
