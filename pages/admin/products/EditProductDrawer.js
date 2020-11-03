import { useState } from 'react';
import firebase from '@/firebase/clientApp';
import { Grid, Form, Input, InputNumber, Button, Drawer, Popconfirm } from 'antd';
import { notification, Card } from 'antd';
import UploadImage from '../../../components/admin/products/UploadImage';
import CategoriesTreeSelect from '../../../components/admin/shared/CategoriesTreeSelect';
import { CloseCircleTwoTone } from '@ant-design/icons';
import { deleteImage } from '@/utils/sharedFunctions';

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

export default function EditProductDrawer({ productData, drawerOn, setdrawerOn }) {
	const [editedProduct, setEditedProduct] = useState({ dateModified: firebase.firestore.Timestamp.now() });
	const refProducts = firebase.firestore().collection('products');
	const refImages = firebase.storage().ref();

	const screens = Grid.useBreakpoint();

	const editProduct = async () => {
		let hasError = null;
		try {
			await refProducts.doc(productData.sku).update(editedProduct);
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
					description: `Product "${editedProduct.name}" has been edited successfully.`,
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
					onClick={() =>
						deleteImage('products', `products/${productData.sku}/images/`, image, productData.sku, 'images')
					}
				/>
			</Card>
		));
	};

	const deleteProduct = async () => {
		let hasError = null;
		try {
			const refProducts = firebase.firestore().collection('products');
			await refProducts
				.doc(productData.sku)
				.delete()
				.then(() => {
					if (productData.images.length > 0) {
						productData.images.forEach((image) => {
							refImages
								.child(`products/${productData.sku}/images/${image.fileName}`)
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
					description: `Product "${productData.name}" has been deleted successfully.`,
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
			style={{ backgroundColor: 'rgba(255, 255, 255, .15)', backdropFilter: 'blur(5px)' }}
		>
			<Form
				layout="vertical"
				name="editProductForm"
				initialValues={{
					['name']: productData ? productData.name : '',
					['description']: productData ? productData.description : '',
					['priceBase']: productData ? productData.priceBase : '',
					['price']: productData ? productData.price : '',
					['quantityInStock']: productData ? productData.quantityInStock : '',
					['sku']: productData ? productData.sku : '',
					['category']: productData ? productData.category : [],
					['images']: productData ? productData.images : [],
				}}
				onFinish={editProduct}
			>
				<Form.Item
					label="Name"
					name="name"
					rules={[{ required: true, message: 'Please input your username!' }]}
				>
					<Input
						placeholder="Name"
						onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
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
						onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
					/>
				</Form.Item>
				<Form.Item
					label="Base Price"
					name="priceBase"
					rules={[{ required: true, message: 'Please input your username!' }]}
				>
					<InputNumber
						placeholder="Base Price"
						onChange={(value) => setEditedProduct({ ...editedProduct, priceBase: value })}
					/>
				</Form.Item>
				<Form.Item
					label=" priceCurrent"
					name="price"
					rules={[{ required: true, message: 'Please input your username!' }]}
				>
					<InputNumber
						placeholder=" Current Price"
						onChange={(value) => setEditedProduct({ ...editedProduct, price: value })}
					/>
				</Form.Item>
				<Form.Item
					label="Quantity in Stock"
					name="quantityInStock"
					rules={[{ required: true, message: 'Please input your username!' }]}
				>
					<InputNumber
						placeholder="Quantity in Stock"
						onChange={(value) => setEditedProduct({ ...editedProduct, quantityInStock: value })}
					/>
				</Form.Item>
				<Form.Item label="SKU" name="sku">
					<Input
						disabled
						placeholder="SKU"
						onChange={(e) => setEditedProduct({ ...editedProduct, sku: e.target.value })}
					/>
				</Form.Item>
				<Form.Item
					label="Category"
					name="category"
					rules={[{ required: true, message: 'Please input your username!' }]}
				>
					<CategoriesTreeSelect
						onChange={(value) => setEditedProduct({ ...editedProduct, category: value })}
					/>
				</Form.Item>
				<Images />
				<Form.Item>
					<UploadImage
						aspect={1}
						collection={'products'}
						path={`products/${productData.sku}/images/`}
						docId={productData.sku}
						array={'images'}
					/>
				</Form.Item>

				<Form.Item>
					<Button type="primary" htmlType="submit">
						Submit
					</Button>

					<Popconfirm
						title={`Are you sure delete this ${productData.name}?`}
						onConfirm={deleteProduct}
						// onCancel={}
						okText="Yes"
						cancelText="No"
					>
						<Button type="secondary">Delete</Button>
					</Popconfirm>
				</Form.Item>
			</Form>
		</Drawer>
	);
}
