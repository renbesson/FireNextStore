import { useState, useEffect } from 'react';
import firebase from '@/firebase/clientApp';

export default function useDocumentSnap(query) {
	const [data, setData] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(null);
	useEffect(() => {
		setLoading(true);
		const unsubscribe = query.onSnapshot(
			(doc) => {
				setData(doc.data());
				setLoading(false);
			},
			function (error) {
				setError(error);
				setLoading(false);
			}
		);
		return () => unsubscribe();
	}, []);

	return [data, error, loading];
}
