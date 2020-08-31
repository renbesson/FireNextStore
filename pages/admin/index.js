import { useState } from 'react';
import { Layout, Menu, Breadcrumb, Button } from 'antd';
import { DesktopOutlined, PieChartOutlined, FileOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import ProductCard from '@/components/ProductCard';
import ProductsAdmin from '@components/admin/products/ProductsAdmin';

Admin.AdminLayout = true;

export default function Admin() {
	return (
		<>
			<ProductsAdmin />
		</>
	);
}
