import { useUser } from '@/context/userContext';
import Breadcrumbs from '@/components/pd/PdBreadcrumbs';
import { Col, Row } from 'antd';
import { useDocument } from '@nandorojo/swr-firestore';
import PdMainCard from '@/components/pd/PdMainCard';
import PdSideCard from '@/components/pd/PdSideCard';
import PdDescription from '@/components/pd/PdDescription';
import BestDeals from '@/components/index/BestDeals';

ProductPage.getInitialProps = ({ query }) => {
	return {
		sku: query.sku,
	};
};

export default function ProductPage({ sku }) {
	const { user } = useUser();
	const { data: product, error } = useDocument(`products/${sku}`);

	if (error) {
		return <h3>{error}</h3>;
	}

	if (product) {
		return (
			<>
				<Row gutter={[20, 20]}>
					<Col span={24}>
						<Breadcrumbs category={product.category} />
					</Col>
				</Row>
				<Row justify="space-between" gutter={[24, 24]}>
					<Col xs={24} lg={18}>
						<PdMainCard productData={product} />
					</Col>
					<Col xs={24} lg={6}>
						<PdSideCard productData={product} />
					</Col>
				</Row>
				<Row gutter={[20, 20]}>
					<Col span={24}>
						<PdDescription productData={product} />
					</Col>
				</Row>
				<BestDeals />
			</>
		);
	} else return <h3>Loading...</h3>;
}
