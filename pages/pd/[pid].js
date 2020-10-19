import { useUser } from '@/context/userContext';
import Breadcrumbs from '@pages/pd/PdBreadcrumbs';
import { Col, Row } from 'antd';
import { useDocument } from '@nandorojo/swr-firestore';
import PdMainCard from '@pages/pd/PdMainCard';
import PdSideCard from './PdSideCard';
import PdDescription from './PdDescription';
import BestDeals from '@components/BestDeals';

ProductPage.getInitialProps = ({ query }) => {
	return {
		pid: query.pid,
	};
};

export default function ProductPage({ pid }) {
	const { user } = useUser();
	const { data: product, error } = useDocument(`products/${pid}`);

	if (error) {
		return <h3>{error}</h3>;
	}

	if (product) {
		return (
			<>
				<Row gutter={[24, 24]}>
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
				<Row gutter={[24, 24]}>
					<Col span={24}>
						<PdDescription productData={product} />
					</Col>
				</Row>
				<BestDeals />
			</>
		);
	} else return <h3>Loading...</h3>;
}
