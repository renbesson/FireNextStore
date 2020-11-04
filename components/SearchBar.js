import { Input } from 'antd';
import { useRouter } from 'next/router';

const { Search } = Input;

export default function SearchBar() {
	const router = useRouter();

	return (
		<Search
			size="large"
			style={{ padding: 0 }}
			placeholder="What are you looking for?"
			onSearch={(value) => router.push(`/pd/search/${value}?sField=category&oField=price&orderBy=asc`)}
			enterButton
		/>
	);
}
