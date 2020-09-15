import firebase from '@/firebase/clientApp';
import { useUser } from '@/context/userContext';
import { useState, useEffect, useContext } from 'react';
import Breadcrumbs from '@/components/pd/Breadcrumbs';
import ClientCarousel from '@components/shared/ClientCarousel';
import { Col, Row, Typography, Button, InputNumber } from 'antd';
import useSWR from 'swr';
import { Context } from '@/context/storeContext';
import { useDocumentSnap } from 'hooks/firebaseHooks';

ProductPage.getInitialProps = ({ query }) => {
	return {
		pid: query.pid,
	};
};
export default function ProductPage({ pid }) {
	const { user } = useUser();
	const [product, error, loading] = useDocumentSnap(firebase.firestore().collection('products').doc(pid));
	const [state, dispatch] = useContext(Context);
	const [quantity, setQuantity] = useState(1);

	const urlsArray =
		product && product.images ? product.images.map((image) => image.url) : ['/images/600px-No_image_available.png'];

	if (error) {
		return <h3>{error}</h3>;
	}

	const putToCart = () => {
		const refUsers = firebase.firestore().collection('users');
		const item = user.cart.find((item) => item.pid === pid);
		//when the product is not in the cart
		if (item !== undefined) {
			if (!user.cart.some((item) => item.quantity === quantity)) {
				refUsers.doc(user.uid).update({
					cart: firebase.firestore.FieldValue.arrayRemove(item),
				});
				refUsers.doc(user.uid).update({
					cart: firebase.firestore.FieldValue.arrayUnion({
						pid,
						quantity,
					}),
				});
			}
		} else {
			refUsers.doc(user.uid).update({
				cart: firebase.firestore.FieldValue.arrayUnion({
					pid,
					quantity,
				}),
			});
		}
	};

	if (product) {
		return (
			<>
				<Row>
					<Col>
						<Breadcrumbs category={product.category} />
					</Col>
				</Row>
				<Row justify="space-between">
					<Col lg={8}>
						<ClientCarousel urls={urlsArray} width={400} height={400} arrowSize="3rem" />
					</Col>
					<Col lg={14}>
						<Row>
							<Col>
								<Typography.Title>{product.title}</Typography.Title>
							</Col>
						</Row>
						<Row justify="end">
							<Col lg={8}>
								<InputNumber
									style={{ width: 56 }}
									min={1}
									max={10}
									defaultValue={1}
									onChange={(value) => setQuantity(value)}
								/>
								<Button block type="primary" onClick={putToCart}>
									Add to Cart
								</Button>
								<Button block>Add to Shopping List</Button>
							</Col>
						</Row>
					</Col>
				</Row>
			</>
		);
	} else return <h3>Loading...</h3>;
}
