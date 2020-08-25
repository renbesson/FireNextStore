import React from 'react';
import { Layout, Row, Col, Card, Image, InputNumber, Button, Typography, Badge, Avatar, Icon } from 'antd';
import SearchBar from '@/components/SearchBar';
import { UserOutlined, HeartOutlined, SnippetsOutlined, ShoppingCartOutlined } from '@ant-design/icons';

const { Header, Footer, Sider, Content } = Layout;

export default function HeaderClient() {
	return (
		<Header style={{ minHeight: '10vh' }}>
			<Row justify="space-between" align="middle">
				<Col span={3}>
					<img style={{ minHeight: '48px', height: '10vh' }} alt="Logo" src="/images/logo.png" />
				</Col>
				<Col span={10}>
					<SearchBar />
				</Col>
				<Col>
					<Button
						style={{ color: '#ffffff', fontSize: '0.75rem' }}
						type="text"
						icon={<UserOutlined style={{ color: '#ffffff', fontSize: '2rem' }} />}
					>
						Entre ou Cadastre-se
					</Button>
					<Button
						style={{ color: '#ffffff', fontSize: '0.75rem' }}
						type="text"
						icon={<HeartOutlined style={{ color: '#ffffff', fontSize: '2rem' }} />}
					>
						Favoritos
					</Button>
					<Button
						style={{ color: '#ffffff', fontSize: '0.75rem' }}
						type="text"
						icon={<SnippetsOutlined style={{ color: '#ffffff', fontSize: '2rem' }} />}
					>
						Lista de Compras
					</Button>
					<Button
						style={{ color: '#ffffff', fontSize: '0.75rem' }}
						type="text"
						icon={<ShoppingCartOutlined style={{ color: '#ffffff', fontSize: '2rem' }} />}
					>
						Carrinho
					</Button>
				</Col>
			</Row>
		</Header>
	);
}
