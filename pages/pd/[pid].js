import { useUser } from '@/context/userContext';
import Breadcrumbs from '@pages/pd/PdBreadcrumbs';
import { Col, Row } from 'antd';
import { useDocument } from '@nandorojo/swr-firestore';
import PdMainCard from '@pages/pd/PdMainCard';
import PdSideCard from './PdSideCard';
import PdDescription from './PdDescription';

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
				<Row>
					<Col>
						<Breadcrumbs category={product.category} />
					</Col>
				</Row>
				<Row justify="space-between">
					<Col span={18}>
						<PdMainCard productData={product} />
					</Col>
					<Col span={5}>
						<PdSideCard productData={product} />
					</Col>
				</Row>
				<Row>
					<Col span={24}>
						<PdDescription productData={product} />
					</Col>
				</Row>
			</>
		);
	} else return <h3>Loading...</h3>;
}
