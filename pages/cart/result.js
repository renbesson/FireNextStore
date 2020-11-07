import { Result, Button } from 'antd';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useShoppingCart } from 'use-shopping-cart';

success.getInitialProps = ({ query }) => {
	return {
		session_id: query.session_id,
	};
};

export default function success({ session_id }) {
	const { clearCart } = useShoppingCart();
	const router = useRouter();

	useEffect(() => {
		if (session_id) clearCart();
	}, []);

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
