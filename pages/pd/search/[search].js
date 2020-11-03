import { useRouter } from 'next/router';
import ProductCard from '@components/ProductCard';
import { Card, Col, Divider, Row, Select, Space, Switch, Typography } from 'antd';
import { useCollection } from '@nandorojo/swr-firestore';

const { Text, Title } = Typography;
const { Option } = Select;
export default function categoriesSearch() {
	const router = useRouter();
	const { search, sField, oField, orderBy } = router.query;
	const { data: products } = useCollection('products', {
		listen: true,
		where: [sField ? sField : 'category', 'array-contains', search],
		orderBy: [oField ? oField : 'name', orderBy ? orderBy : 'asc'],
	});

	const SelectSort = () => (
		<Select
			defaultValue={`${oField}-${orderBy}`}
			onSelect={(value) => {
				switch (value) {
					case 'price-asc':
						router.push(`/pd/search/${search}?sField=category&oField=price&orderBy=asc`);
						break;
					case 'price-desc':
						router.push(`/pd/search/${search}?sField=category&oField=price&orderBy=desc`);
						break;
					case 'name-asc':
						router.push(`/pd/search/${search}?sField=category&oField=name&orderBy=asc`);
						break;
					case 'name-desc':
						router.push(`/pd/search/${search}?sField=category&oField=name&orderBy=desc`);
						`pd/search/Alimentos?sField=category&oField=name&orderBy=asc`;
						break;
				}
			}}
		>
			<Option value="price-asc">Price: Low to High</Option>
			<Option value="price-desc">Price: High to Low</Option>
			<Option value="name-asc">Name: A to Z</Option>
			<Option value="name-desc">Name: Z to A</Option>
		</Select>
	);

	const ProductsList = () => {
		return products.map((product) => {
			return (
				<Col key={product.sku}>
					<ProductCard productData={product} />
				</Col>
			);
		});
	};

	return (
		<Card>
			<Row justify="space-between" gutter={[20, 20]}>
				<Col>
					<Title level={2} className={'m-0'}>
						Searching for {search}
					</Title>
				</Col>
				<Col>
					<Text>Order By: </Text>
					<SelectSort />
				</Col>
			</Row>
			<Divider />
			<Row align="middle" gutter={[20, 20]}>
				{products && <ProductsList />}
			</Row>
		</Card>
	);
}
