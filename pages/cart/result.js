import { useCollection, useDocument } from '@nandorojo/swr-firestore';
import { Result, Button } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useShoppingCart } from 'use-shopping-cart';
import firebase from '@/firebase/clientApp';

success.getInitialProps = ({ query }) => {
	return {
		session_id: query.session_id,
	};
};

export default function success({ session_id }) {
	const { clearCart, redirectToCheckout } = useShoppingCart();
	const getSessionObj = firebase.functions().httpsCallable('retrieveStripeSession');
	const router = useRouter();
	const [sessionObj, setSessionObj] = useState({});
	const { data: orderData, error } = useCollection('orders', {
		listen: true,
		where: [['sessionId', '==', session_id]],
	});

	useEffect(() => {
		if (session_id) clearCart();
	}, []);

	useEffect(() => {
		getSessionObj({ sessionId: session_id }).then((result) => {
			setSessionObj(result.data);
		});
	}, [session_id]);

	if (sessionObj && sessionObj.payment_status === 'paid') {
		return (
			sessionObj &&
			sessionObj.payment_status === 'paid' && (
				<Result
					status="success"
					title="We have received you payment successfully!"
					subTitle={`Order number: ${orderData && orderData[0].id}.`}
					extra={[
						<Button type="primary" key="console" onClick={() => router.push('/')}>
							Go to Home
						</Button>,
					]}
				/>
			)
		);
	} else if (sessionObj && sessionObj.payment_status === 'unpaid') {
		return (
			<Result
				status="error"
				title="We have not received you payment!"
				subTitle={orderData && `Order number: ${orderData[0].id}.`}
				extra={[
					<Button type="primary" key="console" onClick={() => redirectToCheckout({ sessionId: session_id })}>
						Try Again
					</Button>,
				]}
			/>
		);
	} else return <></>;
}
