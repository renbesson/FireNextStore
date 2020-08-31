import { useState } from 'react';
import firebase from '@/firebase/clientApp';
import { Grid, Form, Input, InputNumber, Button, Select, Drawer, Image } from 'antd';
import { notification } from 'antd';
import UploadImage from './UploadImage';

const categories = (level1, level2) => {
	const options = {
		Alimentos: {
			'Básico da despensa': [
				'Cafés, chás e achocolatados',
				'Açúcar e adoçante',
				'Óleos e azeites',
				'Sopas e cremes',
				'Kits e cestas',
				'Farináceos',
				'Massas',
				'Grãos e cereais',
			],
			'Biscoitos, salgadinhos e snacks': ['Salgadinhos e snacks', 'Biscoitos e bolachas'],
			'Carnes e aves': ['Aves', 'Carnes', 'Peixes'],
			Congelados: [
				'Legumes congelados',
				'Petiscos e salgados',
				'Polpas e frutas congeladas',
				'Pratos prontos',
				'Sobremesas prontas',
				'Hambúrgueres e almôndegas',
				'Outros congelados',
			],
			'Doces e sobremesas': ['Bomboniere', 'Compotas e frutas', 'Sorvetes', 'Outros doces'],
			'Enlatados e conservas': [
				'Creme de leite',
				'Leite condensado',
				'Atum e sardinha',
				'Azeitonas',
				'Palmito',
				'Milho',
				'Ervilha',
				'Cogumelos',
				'Outras conservas',
				'Outros enlatados',
				'Patês',
				'Legumes enlatados',
			],
			Frios: [
				'Linguiças e salsichas',
				'Mortadelas, presuntos e apresuntados',
				'Salame e copa',
				'Peito de peru, blanquet e frango',
				'Outros frios',
			],
			'Frutas, legumes e verduras': ['Frutas secas', 'Frutas frescas', 'Legumes', 'Verduras'],
			'Molhos, temperos e condimentos': ['Molhos e condimentos', 'Sal', 'Caldos e realçadores de sabor'],
			Ovos: ['Ovos de galinha', 'Ovos de codorna', 'Ovos de galinhas livres', 'Outros'],
			'Padaria e confeitaria': ['Padaria', 'Confeitaria'],
			'Queijos e laticínios': ['Laticínios', 'Queijos'],
			Rotisserie: [
				'Carnes e Peixes',
				'Guarnições e acompanhamentos',
				'Legumes e vegetais',
				'Pratos resfriados',
				'Outros itens de rotisserie',
			],
			'Sementes e oleaginosas': ['Sementes', 'Amendoim', 'Castanhas', 'Nozes', 'Outros'],
		},
	};
	if (level1 && !level2) {
		return Object.keys(options[level1]).map((item) => (
			<Select.OptGroup key={item} value={item}>
				{options[level1][item].map((item) => (
					<Select.Option key={item} value={item}>
						{item}
					</Select.Option>
				))}
			</Select.OptGroup>
		));
	}
	if (level1 && level2) {
		return Object.keys(options[level1]).map((item) => (
			<Select.OptGroup key={item} value={item}>
				{options[level1][item].map((item) => (
					<Select.Option key={item} value={item}>
						{item}
					</Select.Option>
				))}
			</Select.OptGroup>
		));
	}
	if (!level1 && !level2) return;
};

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
	cursor: 'pointer',
	transition: 'border-color 0.3s ease',
};

export default function EditProductDialog({ productData, drawerOn, setdrawerOn }) {
	const [editedProduct, setEditedProduct] = useState({});

	const screens = Grid.useBreakpoint();

	const editProduct = async () => {
		let hasError = null;
		try {
			const refProducts = firebase.firestore().collection('products');
			const refImages = firebase.storage().ref();
			await refProducts.doc(productData.id).update(editedProduct);
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
		return productData.images.map((image) => <img src={image.url} style={imgStyle} key={image.fileName} />);
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
				name="basic"
				initialValues={{
					['name']: productData ? productData.name : '',
					['description']: productData ? productData.description : '',
					['price']: productData ? productData.price : '',
					['quantity']: productData ? productData.quantity : '',
					['productCode']: productData ? productData.productCode : '',
					['category']: productData ? productData.category : '',
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
						value={editedProduct.name}
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
					<Select
						showSearch
						placeholder="Select a category"
						value={editedProduct.category === undefined ? productData.category : editedProduct.category}
						onChange={(value) => setEditedProduct({ ...editedProduct, category: value })}
					>
						{categories('Alimentos')}
					</Select>
				</Form.Item>
				<Images />
				<Form.Item>
					<UploadImage productId={productData.id} />
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
