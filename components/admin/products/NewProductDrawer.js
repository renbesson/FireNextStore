import { useState } from 'react';
import firebase from '@/firebase/clientApp';
import { Grid, Form, Input, InputNumber, Button, Drawer } from 'antd';
import { notification } from 'antd';
import CategoriesTreeSelect from '../../../components/admin/shared/CategoriesTreeSelect';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('0123456789', 6);

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

export default function NewProductDrawer({ drawerOn, setdrawerOn }) {
	const [form] = Form.useForm();
	const [newId, setNewId] = useState(nanoid());
	const [newProduct, setNewProduct] = useState({
		name: '',
		description: '',
		priceBase: null,
		price: null,
		quantityInStock: null,
		category: [],
		sku: newId,
		images: [],
		currency: 'CAD',
		dateCreated: firebase.firestore.Timestamp.now(),
		dateModified: firebase.firestore.Timestamp.now(),
	});

	const screens = Grid.useBreakpoint();

	const createProduct = async () => {
		let hasError = null;
		try {
			const refProducts = firebase.firestore().collection('products');
			await refProducts.doc(newId).set(newProduct);
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
				setNewId(nanoid());
				notification.success({
					message: 'Product Created Successfully',
					description: `Product "${newProduct.name}" has been created successfully under the "${newProduct.category}" category.`,
				});
			}
		}
	};

	return (
		<Drawer
			title={`Register Product SKU: ${newId}`}
			placement="right"
			closable={true}
			onClose={() => setdrawerOn(false) || setNewId(nanoid())}
			visible={drawerOn}
			width={screens.xs ? '80vw' : '30vw'}
			style={{ backgroundColor: 'rgba(255, 255, 255, .15)', backdropFilter: 'blur(5px)' }}
			destroyOnClose
		>
			<Form layout="vertical" name="newProductForm" form={form} onFinish={createProduct}>
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
						value={newProduct.description}
						onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
					/>
				</Form.Item>
				<Form.Item
					label="Base Price"
					name="priceBase"
					rules={[{ required: true, message: 'Please input your username!' }]}
				>
					<InputNumber
						placeholder="Base Price"
						value={newProduct.priceBase}
						onChange={(value) => setNewProduct({ ...newProduct, priceBase: value })}
					/>
				</Form.Item>
				<Form.Item
					label="Current Price"
					name="price"
					rules={[{ required: true, message: 'Please input your username!' }]}
				>
					<InputNumber
						placeholder="Current Price"
						value={newProduct.price}
						onChange={(value) => setNewProduct({ ...newProduct, price: value })}
					/>
				</Form.Item>
				<Form.Item
					label="Quantity in Stock"
					name="quantityInStock"
					rules={[{ required: true, message: 'Please input your username!' }]}
				>
					<InputNumber
						placeholder="Quantity in Stock"
						value={newProduct.quantityInStock}
						onChange={(value) => setNewProduct({ ...newProduct, quantityInStock: value })}
					/>
				</Form.Item>
				<Form.Item label="SKU" name="sku" rules={[{ min: 7, max: 7 }]}>
					<Input
						placeholder="SKU - Leave blank to auto generate"
						value={newProduct.sku}
						onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
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
			</Form>
		</Drawer>
	);
}
