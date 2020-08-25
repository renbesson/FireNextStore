import { useState } from 'react';
import { Layout, Col, Row, Form, Input, InputNumber, Button, AutoComplete } from 'antd';

const layout = {
	labelCol: { span: 3 },
	wrapperCol: { span: 16 },
};
const tailLayout = {
	wrapperCol: { offset: 8, span: 16 },
};

const onFinish = (values) => {
	console.log('Success:', values);
};

const onFinishFailed = (errorInfo) => {
	console.log('Failed:', errorInfo);
};

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
			<AutoComplete.Option key={item} value={item}>
				{item}
			</AutoComplete.Option>
		));
	}
	if (level1 && level2) {
		console.log(options[level1][level2]);
		return options[level1][level2].map((item) => (
			<AutoComplete.Option key={item} value={item}>
				{item}
			</AutoComplete.Option>
		));
	}
	if (!level1 && !level2) return;
};

export default function NewProductDialog() {
	const [category, setCategory] = useState('');
	const [subCategory, setSubCategory] = useState('');

	return (
		<Form
			{...layout}
			name="basic"
			initialValues={{ remember: true }}
			onFinish={onFinish}
			onFinishFailed={onFinishFailed}
		>
			<Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input your username!' }]}>
				<Input placeholder="Name" />
			</Form.Item>
			<Form.Item
				label="Description"
				name="description"
				rules={[{ required: true, message: 'Please input your username!' }]}
			>
				<Input.TextArea placeholder="Description" autoSize={{ minRows: '4', maxRows: '10' }} />
			</Form.Item>
			<Form.Item label="Price" name="price" rules={[{ required: true, message: 'Please input your username!' }]}>
				<InputNumber placeholder="Price" />
			</Form.Item>
			<Form.Item
				label="Quantity"
				name="quantity"
				rules={[{ required: true, message: 'Please input your username!' }]}
			>
				<InputNumber placeholder="Quantity" />
			</Form.Item>
			<Form.Item
				label="Product Code"
				name="productCode"
				rules={[{ required: true, message: 'Please input your username!' }]}
			>
				<Input placeholder="Product Code" />
			</Form.Item>
			<Form.Item
				label="Category"
				name="category"
				rules={[{ required: true, message: 'Please input your username!' }]}
			>
				<AutoComplete
					value={category}
					onChange={(value) => {
						setSubCategory('');
						setCategory(value);
					}}
					placeholder="Select category"
					filterOption={(inputValue, option) =>
						option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
					}
				>
					{categories('Alimentos')}
				</AutoComplete>
			</Form.Item>
			<Form.Item
				label="Subcategory"
				name="Subcategory"
				rules={[{ required: true, message: 'Please input your username!' }]}
			>
				<AutoComplete
					value={subCategory}
					onChange={(value) => setSubCategory(value)}
					placeholder="Select subcategory"
					filterOption={(inputValue, option) =>
						option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
					}
				>
					{category ? categories('Alimentos', category) : []}
				</AutoComplete>
			</Form.Item>
			<Form.Item>
				<Button type="primary" htmlType="submit">
					Submit
				</Button>
			</Form.Item>
			<p>
				{category} {subCategory}
			</p>
		</Form>
	);
}
