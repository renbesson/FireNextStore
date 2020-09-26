import { useState } from 'react';
import firebase from '@/firebase/clientApp';
import { Grid, Form, Input, InputNumber, Button, Drawer } from 'antd';
import { notification, Card } from 'antd';
import UploadImage from './UploadImage';
import CategoriesTreeSelect from '../shared/CategoriesTreeSelect';
import { CloseCircleTwoTone } from '@ant-design/icons';

const imgStyle = {
	display: 'table',
	float: 'left',
	width: '104px',
	height: '104px',
	marginRight: '8px',
	marginBottom: '8px',
	textAlign: 'center',
	verticalAlign: 'top',
	backgroundColor: '#fafafa',
	border: '1px dashed #d9d9d9',
	borderRadius: '2px',
	transition: 'border-color 0.3s ease',
};

export default function EditProductDialog({ productData, drawerOn, setdrawerOn }) {
	const [editedProduct, setEditedProduct] = useState({ dateModified: firebase.firestore.Timestamp.now() });
	const refProducts = firebase.firestore().collection('products');
	const refImages = firebase.storage().ref();

	const screens = Grid.useBreakpoint();

	const editProduct = async () => {
		let hasError = null;
		try {
			await refProducts.doc(productData.pid).update(editedProduct);
		} catch (error) {
			notification.error({
				message: 'Error Editing Product',
				description: `${error}`,
			});
			console.error(error);
			hasError = true;
		} finally {
			if (!hasError) {
				setdrawerOn(false);
				notification.success({
					message: 'Product Edited Successfully',
					description: `Product "${editedProduct.title}" has been edited successfully.`,
				});
			}
		}
	};

	const Images = () => {
		return productData.images.map((image) => (
			<Card
				bodyStyle={{ padding: 0 }}
				style={imgStyle}
				key={image.fileName}
				cover={<img src={image.url} style={{ padding: 1 }} />}
			>
				<CloseCircleTwoTone
					style={{ position: 'absolute', right: 0, top: 0, fontSize: '1.4rem' }}
					onClick={() => deleteImage(image.fileName)}
				/>
			</Card>
		));
	};

	const deleteImage = async (fileName) => {
		let hasError = null;
		const path = `products/${productData.pid}/images/${fileName}`;
		try {
			refImages
				.child(path)
				.delete()
				.then(() => {
					const imageItem = productData.images.find((image) => image.fileName === fileName);
					refProducts.doc(productData.pid).update({
						images: firebase.firestore.FieldValue.arrayRemove(imageItem),
					});
				});
		} catch (error) {
			notification.error({
				message: 'Error Deleting Image',
				description: `${error}`,
			});
			console.error(error);
			hasError = true;
		} finally {
			if (!hasError) {
				notification.success({
					message: 'Image Deleted Successfully',
					description: `Image "${fileName}" has been deleted successfully.`,
				});
			}
		}
	};

	const deleteProduct = async () => {
		let hasError = null;
		try {
			const refProducts = firebase.firestore().collection('products');
			await refProducts
				.doc(productData.pid)
				.delete()
				.then(() => {
					if (productData.images.length > 0) {
						productData.images.forEach((image) => {
							refImages
								.child(`products/${productData.pid}/images/${image.fileName}`)
								.delete()
								.catch((error) => {
									notification.error({
										message: `Error Deleting Product's image`,
										description: `${error}`,
									});
									alert(`Error deleting product's image!`);
									console.error(error);
								});
						});
					}
				});
		} catch (error) {
			notification.error({
				message: 'Error Deleting Product',
				description: `${error}`,
			});
			console.error(error);
			hasError = true;
		} finally {
			if (!hasError) {
				await setdrawerOn(false);
				notification.success({
					message: 'Product Created Successfully',
					description: `Product "${productData.title}" has been deleted successfully.`,
				});
			}
		}
	};

	return (
		<Drawer
			title="Edit Product"
			placement="right"
			closable={false}
			onClose={() => setdrawerOn(false)}
			visible={drawerOn}
			width={screens.xs ? '80vw' : '30vw'}
		>
			<Form
				layout="vertical"
				name="editProductForm"
				initialValues={{
					['title']: productData ? productData.title : '',
					['description']: productData ? productData.description : '',
					['price']: productData ? productData.price : '',
					['quantity']: productData ? productData.quantity : '',
					['productCode']: productData ? productData.productCode : '',
					['category']: productData ? productData.category : [],
					['images']: productData ? productData.images : [],
				}}
				onFinish={editProduct}
			>
				<Form.Item
					label="Title"
					name="title"
					rules={[{ required: true, message: 'Please input your username!' }]}
				>
					<Input
						placeholder="Title"
						value={editedProduct.title}
						onChange={(e) => setEditedProduct({ ...editedProduct, title: e.target.value })}
					/>
				</Form.Item>
				<Form.Item
					label="Description"
					name="description"
					rules={[{ required: true, message: 'Please input your username!' }]}
				>
					<Input.TextArea
						placeholder="Description"
						autoSize={{ minRows: '4', maxRows: '10' }}
						value={
							editedProduct.description === undefined
								? productData.description
								: editedProduct.description
						}
						onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
					/>
				</Form.Item>
				<Form.Item
					label="Price"
					name="price"
					rules={[{ required: true, message: 'Please input your username!' }]}
				>
					<InputNumber
						placeholder="Price"
						value={editedProduct.price === undefined ? productData.price : editedProduct.price}
						onChange={(value) => setEditedProduct({ ...editedProduct, price: value })}
					/>
				</Form.Item>
				<Form.Item
					label="Quantity"
					name="quantity"
					rules={[{ required: true, message: 'Please input your username!' }]}
				>
					<InputNumber
						placeholder="Quantity"
						value={editedProduct.quantity === undefined ? productData.quantity : editedProduct.quantity}
						onChange={(value) => setEditedProduct({ ...editedProduct, quantity: value })}
					/>
				</Form.Item>
				<Form.Item
					label="Product Code"
					name="productCode"
					rules={[{ required: true, message: 'Please input your username!' }]}
				>
					<Input
						placeholder="Product Code"
						value={
							editedProduct.productCode === undefined
								? productData.productCode
								: editedProduct.productCode
						}
						onChange={(e) => setEditedProduct({ ...editedProduct, productCode: e.target.value })}
					/>
				</Form.Item>
				<Form.Item
					label="Category"
					name="category"
					rules={[{ required: true, message: 'Please input your username!' }]}
				>
					<CategoriesTreeSelect
						value={editedProduct.category === undefined ? productData.category : editedProduct.category}
						onChange={(value) => setEditedProduct({ ...editedProduct, category: value })}
					/>
				</Form.Item>
				<Images />
				<Form.Item>
					<UploadImage productId={productData.pid} />
				</Form.Item>

				<Form.Item>
					<Button type="primary" htmlType="submit">
						Submit
					</Button>
					<Button type="secondary" onClick={deleteProduct}>
						Delete
					</Button>
				</Form.Item>
			</Form>
		</Drawer>
	);
}
