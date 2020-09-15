import firebase from '@/firebase/clientApp';
import { useState, useEffect } from 'react';
import ProductListAdmin from '@/components/admin/products/ProductListAdmin';
import { Typography } from 'antd';
import { useCollectionSnap } from 'hooks/firebaseHooks';

const { Title, Text } = Typography;

indexProductsAdmin.AdminLayout = true;

export default function indexProductsAdmin() {
	const [products, error, loading] = useCollectionSnap(firebase.firestore().collection('products'));

	if (products) {
		return (
			<>
				{error && <Title>Error: {error}</Title>}
				{loading && <Title>Collection: Loading...</Title>}
				<ProductListAdmin products={products} />
			</>
		);
	} else {
		return <></>;
	}
}
