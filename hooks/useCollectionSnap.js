import { useState, useEffect } from 'react';

export default function useCollectionSnap(query) {
	const [data, setData] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(null);
	useEffect(() => {
		setLoading(true);
		const unsubscribe = query.onSnapshot(
			(querySnapshot) => {
				if (querySnapshot.empty) {
					setError('Collection not Found!');
					setLoading(false);
				} else {
					querySnapshot.docChanges().forEach((change) => {
						if (!data.some((item) => item.id === change.doc.id)) {
							if (change.type === 'added') {
								setData((prevData) => [...prevData, change.doc.data()]);
							} else if (change.type === 'modified') {
								setData((prevData) => {
									let newData = [...prevData];
									const productIndex = newData.findIndex((item) => item.id === change.doc.id);
									newData.splice(productIndex, 1, change.doc.data());
									return newData;
								});
							} else if (change.type === 'removed') {
								setData((prevData) => {
									let newData = [...prevData];
									const productIndex = newData.findIndex((item) => item.id === change.doc.id);
									newData.splice(productIndex, 1);
									return newData;
								});
							}
						}
					});
					setLoading(false);
				}
			},
			function (error) {
				setError(error);
			}
		);
		return () => unsubscribe();
	}, []);

	return [data, error, loading];
}
