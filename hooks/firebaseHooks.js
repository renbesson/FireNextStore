import { useState, useEffect } from 'react';

export function useDocumentSnap(query) {
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

// =========================================

export function useCollectionSnap(query) {
	const [data, setData] = useState([]);
	const [error, setError] = useState(undefined);
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		setLoading(true);
		const unsubscribe = query.onSnapshot(
			(querySnapshot) => {
				try {
					if (querySnapshot.empty) {
						console.error('Collection not Found!');
						setLoading(false);
					} else {
						querySnapshot.docChanges().forEach((change) => {
							if (change.type === 'added') {
								// console.log('added');
								if (!data.some((item) => item.id === change.doc.id)) {
									setData((prevData) => [...prevData, change.doc.data()]);
								}
							} else if (change.type === 'modified') {
								// console.log('modified');
								setData((prevData) => {
									let newData = [...prevData];
									const productIndex = newData.findIndex((item) => item.id === change.doc.id);
									newData.splice(productIndex, 1, change.doc.data());
									return newData;
								});
							} else if (change.type === 'removed') {
								// console.log('removed');
								setData((prevData) => {
									let newData = [...prevData];
									const productIndex = newData.findIndex((item) => item.id === change.doc.id);
									newData.splice(productIndex, 1);
									return newData;
								});
							}
						});
						setLoading(false);
					}
				} catch (error) {
					setError(error);
				} finally {
					setLoading(false);
				}
			},
			(error) => {
				setError(error);
			}
		);
		return () => unsubscribe();
	}, []);

	return [data, error, loading];
}
