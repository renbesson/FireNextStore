import { Result, Button } from 'antd';
import { useRouter } from 'next/router';

success.getInitialProps = ({ query }) => {
	return {
		session_id: query.session_id,
	};
};

export default function success({ session_id }) {
	const router = useRouter();

	return (
		<Result
			status="success"
			title="You order has been placed successfully!"
			subTitle={`Order number: ${session_id}.`}
			extra={[
				<Button type="primary" key="console" onClick={() => router.push('/')}>
					Go to Home
				</Button>,
			]}
		/>
	);
}
