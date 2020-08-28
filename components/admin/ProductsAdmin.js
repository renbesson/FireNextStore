import { useEffect } from 'react';
import firebase from '@/firebase/clientApp';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import ProductListAdmin from './ProductListAdmin';

export default function ProductsAdmin() {
	const FirestoreCollection = () => {
		if (firebase.apps.length) {
			const [value, loading, error] = useCollectionData(firebase.firestore().collection('products'), {
				snapshotListenOptions: { includeMetadataChanges: true },
			});

			return (
				<>
					{error && <strong>Error: {JSON.stringify(error)}</strong>}
					{loading && <span>Collection: Loading...</span>}
					{value && <ProductListAdmin products={value} />}
				</>
			);
		} else {
			return <></>;
		}
	};

	return <FirestoreCollection />;
}
