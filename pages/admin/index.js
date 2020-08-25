import { useState } from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import { DesktopOutlined, PieChartOutlined, FileOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import ProductCard from '@/components/ProductCard';
import NewProductDialog from '@components/admin/NewProductDialog';

const { Header, Content, Footer, Sider } = Layout;

Admin.AdminLayout = true;

export default function Admin() {
	const [collapsed, setCollapsed] = useState(false);

	return <NewProductDialog />;
}
