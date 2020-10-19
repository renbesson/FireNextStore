import { useContext } from 'react';
import { useUser } from '../context/userContext';
import { Grid, Layout, Row, Col, Button, Menu, Typography } from 'antd';
import { AppstoreOutlined } from '@ant-design/icons';
import SubMenu from 'antd/lib/menu/SubMenu';
import { useDocument } from '@nandorojo/swr-firestore';
import { useRouter } from 'next/router';
import { Context } from '@/context/storeContext';

const { Text } = Typography;

export default function HeaderClient() {
	const { loadingUser, user } = useUser();
	const { data: categories, error } = useDocument('misc/categories');
	const router = useRouter();
	const [state, dispatch] = useContext(Context);

	const screens = Grid.useBreakpoint();

	const Categories = (
		<Menu
			mode="horizontal"
			onClick={({ key }) => router.push(`/pd/search/${key}?sField=category&oField=price&orderBy=asc`)}
		>
			<SubMenu key="sub2" icon={<AppstoreOutlined />} title="Categories">
				{categories &&
					Object.keys(categories)
						.sort()
						.map((categoryLevel1) => {
							//If statement prevents to map the variables id, exists, and hasPendingWrites.
							if (categories[categoryLevel1] instanceof Object) {
								return (
									<SubMenu key={categoryLevel1} title={categoryLevel1}>
										{Object.keys(categories[categoryLevel1])
											.sort()
											.map((categoryLevel2) => {
												return (
													<SubMenu key={categoryLevel2} title={categoryLevel2}>
														{categories[categoryLevel1][categoryLevel2]
															.sort()
															.map((item) => {
																return <Menu.Item key={item}>{item}</Menu.Item>;
															})}
													</SubMenu>
												);
											})}
									</SubMenu>
								);
							}
						})}
			</SubMenu>
		</Menu>
	);

	return (
		<>
			<Row
				justify="space-around"
				style={{ backgroundColor: '#fff', borderTop: '1px solid gray', borderBottom: '1px solid gray' }}
			>
				<Col>{Categories}</Col>
				<Col>
					<Button type="link">Nossa Loja</Button>
				</Col>
				<Col>
					<Button type="link">Fale Pelo Zap</Button>
				</Col>
				<Col>
					<Button type="link">Encarte</Button>
				</Col>
				<Col>
					<Button type="link" style={{ fontWeight: 'bold', color: 'blue' }}>
						Ofertas do Dia!
					</Button>
				</Col>
			</Row>
		</>
	);
}
