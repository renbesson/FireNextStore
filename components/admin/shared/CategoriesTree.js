import { Tree } from 'antd';
import { useState, useContext, useEffect } from 'react';
import firebase from '@/firebase/clientApp';

function createCategory(string, bool) {
	if (typeof string === 'string') {
		return {
			title: string,
			value: string,
			key: string,
			disabled: bool ? bool : false,
			children: [],
		};
	} else console.error('Element provided is not a string!');
}

export default function CategoriesTreeSelect({ value, onChange }) {
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
					console.log(finalTreeData);
				}
			});

		return () => {};
	}, []);

	function filter(inputValue, path) {
		return path.some((option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
	}

	return (
		<>
			<Tree
				showIcon
                showLine
                selectable
                showLeafIcon
				showSearch={{ filter }}
				value={value}
				treeData={treeData}
				placeholder="Please select"
				onChange={onChange}
			/>
		</>
	);
}
