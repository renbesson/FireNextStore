import { useState } from 'react';
import firebase from '@/firebase/clientApp';
import { Grid, Form, Input, InputNumber, Button, Select, Drawer } from 'antd';
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

export default function NewProductDialog({ drawerOn, setdrawerOn }) {
	const [newProduct, setNewProduct] = useState({
		name: '',
		description: '',
		price: null,
		quantity: null,
		category: '',
		productCode: '',
	});

	const [imageList, setImageList] = useState([]);

	const screens = Grid.useBreakpoint();

	const createProduct = async () => {
		let hasError = null;
		try {
			const refProducts = firebase.firestore().collection('products');
			await refProducts.add(newProduct).then((doc) => {
				refProducts.doc(doc.id).update({
					id: doc.id,
				});
				if (newProduct.images.length > 0) {
					newProduct.images.forEach((file, index) => {
						const fileName = `${doc.id}-${index}.jpg`;
						const path = `products/${doc.id}/images/${fileName}`;
						const refImages = firebase.storage().ref().child(path);
						refImages.put(file).then((snapshot) => {
							snapshot.ref.getDownloadURL().then((URL) => {
								refProducts.doc(doc.id).update({
									images: firebase.firestore.FieldValue.arrayUnion({
										url: URL,
										fileName: fileName,
									}),
								});
							});
						});
					});
				}
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
			placement="right"
			closable={false}
			onClose={() => setdrawerOn(false)}
			visible={drawerOn}
			width={screens.xs ? '80vw' : '30vw'}
		>
			<Form layout="vertical" name="basic" initialValues={{ remember: true }} onFinish={createProduct}>
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
					<Select
						showSearch
						placeholder="Select a category"
						value={newProduct.category}
						onChange={(value) => {
							setNewProduct({ ...newProduct, category: value });
						}}
					>
						{categories('Alimentos')}
					</Select>
				</Form.Item>
				<Form.Item>
					<UploadImage productId={} imageList={imageList} setImageList={setImageList} />
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit">
						Submit
					</Button>
				</Form.Item>
			</Form>
			<p>Images: {JSON.stringify(imageList)}</p>
		</Drawer>
	);
}
