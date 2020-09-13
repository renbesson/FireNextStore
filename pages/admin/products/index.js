import firebase from '@/firebase/clientApp';
import { useState, useEffect } from 'react';
import ProductListAdmin from '@/components/admin/products/ProductListAdmin';
import { Typography } from 'antd';
import useCollectionSnap from '../../../hooks/useCollectionSnap';

const { Title, Text } = Typography;

indexProductsAdmin.AdminLayout = true;

export default function indexProductsAdmin() {
	const [products, error, loading] = useCollectionSnap(firebase.firestore().collection('products'));

	console.log('Context: ', products);

	if (products) {
		return (
			<>
				{/* {error && <Title>Error: {JSON.stringify(error)}</Title>}
				{loading && <Title>Collection: Loading...</Title>} */}
				<ProductListAdmin products={products} />
				<p>Error: {error}</p>
				<p>Loading: {loading}</p>
			</>
		);
	} else {
		return <></>;
	}
}
