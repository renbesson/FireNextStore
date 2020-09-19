import '@/firebase/clientApp';
import '../styles/css/antd.css';
import '../styles/vars.css';
import '../styles/global.css';
import Link from 'next/link';

import UserProvider from '@/context/userContext';
import Head from 'next/head';

import { useState } from 'react';
import { Grid, Layout, Menu, Breadcrumb } from 'antd';
import { DesktopOutlined, PieChartOutlined, FileOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';

import HeaderClient from '@/components/HeaderClient';
import StoreProvider from '@context/storeContext';

const { Header, Footer, Sider, Content } = Layout;

export default function App({ Component, pageProps }) {
	const [collapsed, setCollapsed] = useState(false);

	const screens = Grid.useBreakpoint();

	if (Component.AdminLayout) {
		return (
			<Layout style={{ minHeight: '100vh' }}>
				<Sider
					collapsible
					collapsed={collapsed}
					onCollapse={() => setCollapsed((prevCollapsed) => !prevCollapsed)}
				>
					<div className="logo" />
					<Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" style={{ paddingTop: '5vh' }}>
						<Menu.Item key="1" icon={<PieChartOutlined />}>
							<Link href="/admin/products/">
								<a>Products</a>
							</Link>
						</Menu.Item>
						<Menu.Item key="2" icon={<DesktopOutlined />}>
							<Link href="/admin/categories/">
								<a>Categories</a>
							</Link>
						</Menu.Item>
						<Menu.Item key="3" icon={<UserOutlined />}>
							Option 3
						</Menu.Item>
						<Menu.Item key="4" icon={<TeamOutlined />}>
							Option 4
						</Menu.Item>
						<Menu.Item key="5" icon={<FileOutlined />}>
							Option 5
						</Menu.Item>
					</Menu>
				</Sider>
				<Layout className="site-layout">
					<Header className="site-layout-background" style={{ padding: 0, height: '5vh' }} />
					<Content style={{ margin: '0 16px' }}>
						<Breadcrumb style={{ margin: '16px 0' }}>
							<Breadcrumb.Item>User</Breadcrumb.Item>
							<Breadcrumb.Item>Bill</Breadcrumb.Item>
						</Breadcrumb>
						<div className="site-layout-background" style={{ padding: '24', minHeight: '360' }}>
							<UserProvider>
								<Component {...pageProps} />
							</UserProvider>
						</div>
					</Content>
					<Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
				</Layout>
			</Layout>
		);
	}

	return (
		<StoreProvider>
			<Head>
				<title>Next.js w/ Firebase Client-Side</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Layout>
				<nav>
					<UserProvider>
						<HeaderClient />
					</UserProvider>
				</nav>
				<Content
					style={{
						padding: '32px',
						alignSelf: 'center',
						// margin: '32px',
						maxWidth: screens.xs ? '100vw' : '1200px',
						width: screens.xs ? '100vw' : '95vw',
						backgroundColor: '#ffffff',
					}}
				>
					<UserProvider>
						<Component {...pageProps} />
					</UserProvider>
				</Content>
				<Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
			</Layout>
		</StoreProvider>
	);
}
