import { Input } from 'antd';
import { AudioOutlined } from '@ant-design/icons';

const { Search } = Input;

export default function SearchBar() {
	return (
		<Search
			size="large"
			style={{ width: '100%', border: '2px white solid', borderRadius: '8px' }}
			placeholder="input search text"
			onSearch={(value) => console.log(value)}
			enterButton
		/>
	);
}
