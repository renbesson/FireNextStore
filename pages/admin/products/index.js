import firebase from '@/firebase/clientApp';
import { useState, useEffect } from 'react';
import ProductListAdmin from '@/components/admin/products/ProductListAdmin';
import { Typography } from 'antd';
import { useCollectionSnap } from 'hooks/firebaseHooks';
import { useCollection } from '@nandorojo/swr-firestore';

const { Title, Text } = Typography;

indexProductsAdmin.AdminLayout = true;

export default function indexProductsAdmin() {
	// const [products, error, loading] = useCollectionSnap(firebase.firestore().collection('products'));
	const { data: products, error } = useCollection('products', { listen: true });

	if (products) {
		return (
			<>
				{error && <Title>Error: {error}</Title>}
				<ProductListAdmin products={products} />
			</>
		);
	} else {
		return <></>;
	}
}
