import '@/firebase/clientApp';
import '../styles/css/antd.css';
import '../styles/vars.css';
import '../styles/global.css';
import Link from 'next/link';
import ClientFooter from '@/components/ClientFooter';

import UserProvider from '@/context/userContext';
import Head from 'next/head';

import { useState } from 'react';
import { Grid, Layout, Menu, Breadcrumb } from 'antd';
import { DesktopOutlined, PieChartOutlined, FileOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';

import HeaderClient from '@/components/HeaderClient';
import StoreProvider from '@context/storeContext';

import { Fuego, FuegoProvider } from '@nandorojo/swr-firestore';

const clientCredentials = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const fuego = new Fuego(clientCredentials);

const { Header, Footer, Sider, Content } = Layout;

export default function App({ Component, pageProps }) {
	const [collapsed, setCollapsed] = useState(false);

	const screens = Grid.useBreakpoint();

	if (Component.AdminLayout) {
		return (
			<FuegoProvider fuego={fuego}>
				<Layout style={{ minHeight: '100vh' }}>
					<Sider
						collapsible
						collapsedWidth={64}
						collapsed={collapsed}
						onCollapse={() => setCollapsed((prevCollapsed) => !prevCollapsed)}
					>
						<div className="logo" />
						<Menu
							theme="dark"
							defaultSelectedKeys={['1']}
							mode="inline"
							style={{ paddingTop: '5vh', width: collapsed ? '64px' : null }}
						>
							<Menu.Item key="1" className={'p-0'} icon={<PieChartOutlined style={{ width: '64px' }} />}>
								<Link href="/admin/products/">
									<a>Products</a>
								</Link>
							</Menu.Item>
							<Menu.Item key="2" className={'p-0'} icon={<DesktopOutlined style={{ width: '64px' }} />}>
								<Link href="/admin/categories/">
									<a>Categories</a>
								</Link>
							</Menu.Item>
							<Menu.Item key="3" className={'p-0'} icon={<UserOutlined style={{ width: '64px' }} />}>
								Option 3
							</Menu.Item>
							<Menu.Item key="4" className={'p-0'} icon={<TeamOutlined style={{ width: '64px' }} />}>
								Option 4
							</Menu.Item>
							<Menu.Item key="5" className={'p-0'} icon={<FileOutlined style={{ width: '64px' }} />}>
								Option 5
							</Menu.Item>
						</Menu>
					</Sider>
					<Layout className="site-layout">
						<Header className="site-layout-background" style={{ padding: 0, height: '5vh' }} />
						<Content style={{ margin: '32px' }}>
							<div className="site-layout-background" style={{ padding: '24', minHeight: '360' }}>
								<UserProvider>
									<Component {...pageProps} />
								</UserProvider>
							</div>
						</Content>
						<Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
					</Layout>
				</Layout>
			</FuegoProvider>
		);
	}

	return (
		<FuegoProvider fuego={fuego}>
			<StoreProvider>
				<Head>
					<title>Next.js w/ Firebase Client-Side</title>
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<Layout>
					<Header
						style={{
							padding: '0px',
							alignSelf: 'center',
							maxWidth: screens.xs ? '100vw' : '1200px',
							width: '100vw',
							minHeight: screens.xs ? '25vh' : '15vh',
							borderRadius: '5px',
						}}
					>
						<UserProvider>
							<HeaderClient />
						</UserProvider>
					</Header>
					<Content
						style={{
							margin: '32px',
							alignSelf: 'center',
							maxWidth: screens.xs ? '100vw' : '1200px',
							width: '100vw',
							minHeight: screens.xs ? '45vh' : '75vh',
						}}
					>
						<UserProvider>
							<Component {...pageProps} />
						</UserProvider>
					</Content>
					<Footer
						style={{
							padding: '0px',
							alignSelf: 'center',
							maxWidth: screens.xs ? '100vw' : '1200px',
							width: '100vw',
							minHeight: screens.xs ? '25vh' : '10vh',
						}}
					>
						<ClientFooter />
					</Footer>
				</Layout>
			</StoreProvider>
		</FuegoProvider>
	);
}
