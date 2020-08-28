import { useState } from 'react';
import { Layout, Menu, Breadcrumb, Button } from 'antd';
import { DesktopOutlined, PieChartOutlined, FileOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import ProductCard from '@/components/ProductCard';
import NewProductDialog from '@components/admin/NewProductDialog';

const { Header, Content, Footer, Sider } = Layout;

Admin.AdminLayout = true;

export default function Admin() {
	const [newProductDrawerOn, setNewProductDrawerOn] = useState(false);

	return (
		<>
			<Button onClick={() => setNewProductDrawerOn(true)}>Add</Button>
			<NewProductDialog drawerOn={newProductDrawerOn} setdrawerOn={setNewProductDrawerOn} />
		</>
	);
}
