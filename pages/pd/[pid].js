import firebase from '@/firebase/clientApp';
import { useUser } from '@/context/userContext';
import { useState } from 'react';
import Breadcrumbs from '@pages/pd/PdBreadcrumbs';
import ClientCarousel from '@components/shared/ClientCarousel';
import { Col, Row, Typography, Button, InputNumber } from 'antd';
import { useDocument } from '@nandorojo/swr-firestore';
import PdMainCard from '@pages/pd/PdMainCard';
import PdSideCard from './PdSideCard';

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
					<Col span={16}>
						<PdMainCard productData={product} />
					</Col>
					<Col span={6}>
						<PdSideCard productData={product} />
					</Col>
				</Row>
			</>
		);
	} else return <h3>Loading...</h3>;
}
