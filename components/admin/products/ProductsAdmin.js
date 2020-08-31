import firebase from '@/firebase/clientApp';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import ProductListAdmin from './ProductListAdmin';
import { Typography } from 'antd';

const { Title, Text } = Typography;

export default function ProductsAdmin() {
	if (firebase.apps.length) {
		const [value, loading, error] = useCollectionData(firebase.firestore().collection('products'), {
			snapshotListenOptions: { includeMetadataChanges: true },
		});

		return (
			<>
				{/* {error && <Title>Error: {JSON.stringify(error)}</Title>}
				{loading && <Title>Collection: Loading...</Title>} */}
				{value && <ProductListAdmin products={value} />}
			</>
		);
	} else {
		return <></>;
	}
}
