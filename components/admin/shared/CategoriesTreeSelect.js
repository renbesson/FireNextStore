import { TreeSelect, Cascader } from 'antd';
import { useState, useContext, useEffect } from 'react';
import firebase from '@/firebase/clientApp';

function createCategory(string, bool) {
	if (typeof string === 'string') {
		return {
			label: string,
			value: string,
			key: string,
			disabled: bool ? bool : false,
			children: [],
		};
	} else console.error('Element provided is not a string!');
}

export default function CategoriesTreeSelect({ value, onChange }) {
	const [selection, setSelection] = useState(undefined);
	// const [rawData, setRawData] = useState(null);
	const [treeData, setTreeData] = useState([]);

	useEffect(() => {
		firebase
			.firestore()
			.collection('misc')
			.doc('categories')
			.onSnapshot((doc) => {
				let rawData = doc.data();
				let finalTreeData = [];
				if (rawData && rawData instanceof Object) {
					Object.entries(rawData).forEach((categoriesLevel1, categoriesLevel1Index) => {
						// ++ Creates level 1 categories eg: 'Alimentos' --
						finalTreeData.push(createCategory(categoriesLevel1[0]));
						if (categoriesLevel1[1] instanceof Object) {
							Object.entries(categoriesLevel1[1]).forEach((categoriesLevel2, categoriesLevel2Index) => {
								// ++ Creates level 2 categories eg: 'Basico da despensa' --
								finalTreeData[categoriesLevel1Index].children.push(createCategory(categoriesLevel2[0]));
								if (categoriesLevel2[1] instanceof Array) {
									categoriesLevel2[1].forEach((subCategory) =>
										finalTreeData[categoriesLevel1Index].children[
											categoriesLevel2Index
										].children.push(createCategory(subCategory))
									);
								}
							});
						}
					});
					setTreeData(finalTreeData);
				}
			});

		return () => {};
	}, []);

	function filter(inputValue, path) {
		return path.some((option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
	}

	return (
		<>
			<Cascader
				showSearch={{ filter }}
				value={value}
				options={treeData}
				placeholder="Please select"
				onChange={onChange}
			/>
		</>
	);
}
