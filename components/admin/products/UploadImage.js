import firebase from '@/firebase/clientApp';
import { useState } from 'react';
import { Upload, notification } from 'antd';
import ImgCrop from 'antd-img-crop';

export default function UploadImage({ aspect, collection, path, docId, array }) {
	const refProducts = collection && firebase.firestore().collection(collection);
	const refImages = firebase.storage().ref();

	const [imageList, setImageList] = useState([]);

	const customUpload = async ({ file: originFileObj }) => {
		const pathFinal = `${path}${originFileObj.name}`;
		refImages.child(pathFinal);
		let hasError = false;
		try {
			refImages
				.child(pathFinal)
				.put(originFileObj)
				.then((snapshot) => {
					snapshot.ref
						.getDownloadURL()
						.then((URL) => {
							refProducts.doc(docId).update({
								[array]: firebase.firestore.FieldValue.arrayUnion({
									url: URL,
									fileName: originFileObj.name,
								}),
							});
						})
						.catch(() => {
							hasError = true;
						});
				});
		} catch (error) {
			notification.error({
				message: 'Image Upload',
				description: `${JSON.stringify(error)}`,
			});
		} finally {
			if (!hasError) {
				notification.success({
					message: 'Image Upload',
					description: `Image "${originFileObj.name}" uploaded successfully.`,
				});
			}
			setImageList([]);
		}
	};

	return (
		<>
			<ImgCrop rotate aspect={aspect}>
				<Upload listType="picture-card" fileList={imageList} customRequest={customUpload}>
					{imageList.length < 5 && '+ Upload'}
				</Upload>
			</ImgCrop>
		</>
	);
}
