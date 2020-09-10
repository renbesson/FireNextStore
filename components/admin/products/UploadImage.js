import firebase from '@/firebase/clientApp';
import { useState } from 'react';
import { Upload, notification } from 'antd';
import ImgCrop from 'antd-img-crop';

export default function UploadImage({ productId }) {
	const refProducts = firebase.firestore().collection('products');
	const refImages = firebase.storage().ref();

	const [imageList, setImageList] = useState([]);

	const onChange = ({ fileList: newFileList }) => {
		setImageList(newFileList);
	};

	const onPreview = async (file) => {
		let src = file.url;
		if (!src) {
			src = await new Promise((resolve) => {
				const reader = new FileReader();
				reader.readAsDataURL(file.originFileObj);
				reader.onload = () => resolve(reader.result);
			});
		}
		const image = new Image();
		image.src = src;
		const imgWindow = window.open(src);
		imgWindow.document.write(image.outerHTML);
	};

	const customUpload = async ({ file: originFileObj }) => {
		const path = `products/${productId}/images/${originFileObj.title}`;
		refImages.child(path);
		const hasError = false;
		try {
			refImages
				.child(path)
				.put(originFileObj)
				.then((snapshot) => {
					snapshot.ref
						.getDownloadURL()
						.then((URL) => {
							refProducts.doc(productId).update({
								images: firebase.firestore.FieldValue.arrayUnion({
									url: URL,
									fileName: originFileObj.title,
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
					description: `Image "${originFileObj.title}" uploaded successfully.`,
				});
			}
			setImageList([]);
		}
	};

	return (
		<>
			<ImgCrop rotate aspect={1}>
				<Upload listType="picture-card" fileList={imageList} onPreview={onPreview} customRequest={customUpload}>
					{imageList.length < 5 && '+ Upload'}
				</Upload>
			</ImgCrop>
		</>
	);
}
