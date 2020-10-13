import { Input } from 'antd';
import { AudioOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';

const { Search } = Input;

export default function SearchBar() {
	const router = useRouter();

	return (
		<Search
			size="large"
			style={{ width: '100%', border: '2px white solid', borderRadius: '8px' }}
			placeholder="input search text"
			onSearch={(value) => router.push(`/pd/search/${value}?sField=category&oField=price&orderBy=asc`)}
			enterButton
		/>
	);
}
