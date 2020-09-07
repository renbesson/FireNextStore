import { useState } from 'react';
import firebase from '@/firebase/clientApp';
import { Grid, Form, Input, InputNumber, Button, Drawer } from 'antd';
import { notification } from 'antd';
import CategoriesTreeSelect from '../shared/CategoriesTreeSelect';

const imgStyle = {
	display: 'table',
	float: 'left',
	width: '104px',
	height: '104px',
	marginRight: '8px',
	marginBottom: '8px',
	textAlign: 'center',
	verticalAlign: 'text-bottom',
	backgroundColor: '#fafafa',
	border: '1px dashed #d9d9d9',
	borderRadius: '2px',
	transition: 'border-color 0.3s ease',
};

export default function NewProductDialog({ drawerOn, setdrawerOn }) {
	const [form] = Form.useForm();
	const [newProduct, setNewProduct] = useState({
		name: '',
		description: '',
		price: null,
		quantity: null,
		category: [],
		productCode: '',
		images: [],
	});

	const screens = Grid.useBreakpoint();

	const createProduct = async () => {
		let hasError = null;
		try {
			const refProducts = firebase.firestore().collection('products');
			await refProducts.add(newProduct).then((doc) => {
				refProducts.doc(doc.id).update({
					id: doc.id,
				});
			});
		} catch (error) {
			notification.error({
				message: 'Error Creating Product',
				description: `${error}`,
			});
			console.error(error);
			hasError = true;
		} finally {
			if (!hasError) {
				form.resetFields();
				setdrawerOn(false);
				notification.success({
					message: 'Product Created Successfully',
					description: `Product "${newProduct.name}" has been created successfully under the "${newProduct.category}" category.`,
				});
			}
		}
	};

	return (
		<Drawer
			title="Register Product"
			placement="right"
			closable={false}
			onClose={() => setdrawerOn(false)}
			visible={drawerOn}
			width={screens.xs ? '80vw' : '30vw'}
		>
			<Form layout="vertical" name="editProductForm" form={form} onFinish={createProduct}>
				<Form.Item
					label="Name"
					name="name"
					rules={[{ required: true, message: 'Please input your username!' }]}
				>
					<Input
						placeholder="Name"
						value={newProduct.name}
						onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
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
						value={newProduct.name}
						onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
					/>
				</Form.Item>
				<Form.Item
					label="Price"
					name="price"
					rules={[{ required: true, message: 'Please input your username!' }]}
				>
					<InputNumber
						placeholder="Price"
						value={newProduct.price}
						onChange={(value) => setNewProduct({ ...newProduct, price: value })}
					/>
				</Form.Item>
				<Form.Item
					label="Quantity"
					name="quantity"
					rules={[{ required: true, message: 'Please input your username!' }]}
				>
					<InputNumber
						placeholder="Quantity"
						value={newProduct.quantity}
						onChange={(value) => setNewProduct({ ...newProduct, quantity: value })}
					/>
				</Form.Item>
				<Form.Item
					label="Product Code"
					name="productCode"
					rules={[{ required: true, message: 'Please input your username!' }]}
				>
					<Input
						placeholder="Product Code"
						value={newProduct.productCode}
						onChange={(e) => setNewProduct({ ...newProduct, productCode: e.target.value })}
					/>
				</Form.Item>
				<Form.Item
					label="Category"
					name="category"
					rules={[{ required: true, message: 'Please input your username!' }]}
				>
					<CategoriesTreeSelect
						value={newProduct.category}
						onChange={(value) => {
							setNewProduct({ ...newProduct, category: value });
						}}
					/>
				</Form.Item>
				<Form.Item>
					<div style={imgStyle}>Image upload available on edit mode only.</div>
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit">
						Submit
					</Button>
				</Form.Item>
				<p>{JSON.stringify(newProduct)}</p>
			</Form>
		</Drawer>
	);
}
