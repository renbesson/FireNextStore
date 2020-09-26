import firebase from '@/firebase/clientApp';
import { useUser } from '@/context/userContext';
import { useState } from 'react';
import Breadcrumbs from '@pages/pd/Breadcrumbs';
import ClientCarousel from '@components/shared/ClientCarousel';
import { Col, Row, Typography, Button, InputNumber } from 'antd';
import { useDocumentSnap } from 'hooks/firebaseHooks';

ProductPage.getInitialProps = ({ query }) => {
	return {
		pid: query.pid,
	};
};

export default function ProductPage({ pid }) {
	const { user } = useUser();
	const [product, error, loading] = useDocumentSnap(firebase.firestore().collection('products').doc(pid));
	const [quantity, setQuantity] = useState(1);

	const urlsArray =
		product && product.images ? product.images.map((image) => image.url) : ['/images/600px-No_image_available.png'];

	const addToCart = async () => {
		const refUsers = firebase.firestore().collection('users');

		// Error prevention case cart doesn't exist
		if (!user.cart) {
			await refUsers.doc(user.uid).update({
				cart: [],
			});
		}

		const itemInCart = await user.cart.find((item) => item.pid === pid);

		//when the product is not in the cart
		if (itemInCart !== undefined) {
			if (itemInCart.quantity !== quantity) {
				await refUsers.doc(user.uid).update({
					cart: firebase.firestore.FieldValue.arrayRemove(itemInCart),
				});
				await refUsers.doc(user.uid).update({
					cart: firebase.firestore.FieldValue.arrayUnion({
						pid,
						quantity,
					}),
				});
			}
		} else {
			await refUsers.doc(user.uid).update({
				cart: firebase.firestore.FieldValue.arrayUnion({
					pid,
					quantity,
				}),
			});
		}
	};

	if (error) {
		return <h3>{error}</h3>;
	}

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
								<Button block type="primary" onClick={addToCart}>
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
