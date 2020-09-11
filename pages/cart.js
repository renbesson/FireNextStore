import useSWR from 'swr';

const fetcher = async (...args) => {
	const res = await fetch(...args);
	return res.json();
};

export default function cart() {
	return <div></div>;
}
