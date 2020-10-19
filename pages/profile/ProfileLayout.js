import { Typography, Button, Row, Col } from 'antd';
import { UserOutlined, BoxPlotOutlined, HeartOutlined, SnippetsOutlined, AimOutlined } from '@ant-design/icons';
import Link from 'next/link';

const ProfileButtons = () => {
	const buttons = [
		{ title: 'Account', icon: <UserOutlined style={{ fontSize: '2rem' }} />, link: '/profile/account' },
		{ title: 'Orders', icon: <BoxPlotOutlined style={{ fontSize: '2rem' }} />, link: '/profile/orders' },
		{ title: 'Addresses', icon: <AimOutlined style={{ fontSize: '2rem' }} />, link: '/profile/addresses' },
		{ title: 'Favorites', icon: <HeartOutlined style={{ fontSize: '2rem' }} />, link: '/profile/favorites' },
		{
			title: 'My Lists',
			icon: <SnippetsOutlined style={{ fontSize: '2rem' }} />,
			link: '/profile/lists',
		},
	];

	return buttons.map((button) => (
		<Row key={button.title}>
			<Col>
				<Link href={button.link}>
					<Button type="link" icon={button.icon} size="large" className={'mb-2'}>
						{button.title}
					</Button>
				</Link>
			</Col>
		</Row>
	));
};

export default function ProfileLayout({ children }) {
	return (
		<Row justify="space-between">
			<Col
				xs={24}
				lg={4}
				style={{
					minWidth: '250px',
					borderRight: '2px solid black',
					borderBottom: '2px solid black',
					boxShadow: '10px 10px 10px 2px rgba(0, 0, 0, 0.3)',
				}}
			>
				<Typography.Title className={'mb-3'}>My Account</Typography.Title>
				<ProfileButtons />
			</Col>
			<Col xs={24} lg={18}>
				{children}
			</Col>
		</Row>
	);
}
