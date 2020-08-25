import { Menu, Icon } from 'antd';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

export default function RightMenu() {
	return (
		<Menu mode="horizontal">
			<Menu.Item key="mail">
				<a href="">Signin</a>
			</Menu.Item>
			<Menu.Item key="app">
				<a href="">Signup</a>
			</Menu.Item>
		</Menu>
	);
}
