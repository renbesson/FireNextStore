import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import firebase from '@/firebase/clientApp';
import { useUser } from '@/context/userContext';
import { Row, Col, Card, InputNumber, Button, Typography, Badge, notification, Image } from 'antd';
import { HeartFilled, HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { addToCart, favoriteSet, updateToCart } from '@/utils/sharedFunctions';

const { Title, Text, Paragraph } = Typography;

export default function ProductCard({ productData }) {
	const router = useRouter();
	const { user } = useUser();
	const [quantity, setQuantity] = useState(1);

	const itemInCart = user && user.cart && user.cart.find(({ pid }) => pid === productData.pid);
	const isFavorite = user && user.favorites && user.favorites.some((item) => item === productData.pid);

	return (
		<Badge
			style={{
				width: '35px',
				height: '35px',
				fontWeight: 'bold',
				borderRadius: '35px',
				lineHeight: '35px',
				paddingLeft: '3px',
			}}
			count={`-${parseInt(((productData.priceBase - productData.price) / productData.priceBase) * 100)}%`}
		>
			<Card hoverable style={{ width: 200 }} bodyStyle={{ padding: '1rem' }}>
				<Row>
					<Col>
						<Button
							onClick={() => favoriteSet(productData, isFavorite, user && user.uid)}
							type="link"
							icon={
								isFavorite ? (
									<HeartFilled style={{ fontSize: '1.3rem' }} />
								) : (
									<HeartOutlined style={{ fontSize: '1.3rem' }} />
								)
							}
						></Button>
					</Col>
				</Row>
				<Row>
					<Col>
						<Image
							preview={false}
							alt="example"
							src={
								productData.images.length
									? productData.images[0].url
									: '/images/600px-No_image_available.png'
							}
							onClick={() => router.push(`/pd/${productData.pid}`)}
						/>
					</Col>
				</Row>
				<Row>
					<Paragraph ellipsis={{ rows: 2 }} style={{ height: 44 }}>
						{productData.title}
					</Paragraph>
				</Row>
				<Row justify="space-between">
					<Col span={16} className={'m-0'}>
						<Title level={4}>
							{new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(
								productData.price
							)}
						</Title>
					</Col>
					<Col span={8}>
						<InputNumber
							style={{ width: 56 }}
							min={1}
							max={10}
							defaultValue={1}
							onChange={(value) => setQuantity(value)}
						/>
					</Col>
				</Row>
				<Row>
					<Button
						block
						color="red-6"
						type="primary"
						onClick={() =>
							itemInCart
								? itemInCart && itemInCart.quantity === quantity
									? notification.warning({
											message: 'Product Already in the Cart',
											description: `Product "${productData.title}" is already in the cart with this quantity.`,
									  })
									: updateToCart(productData, itemInCart.quantity, quantity, user && user.uid)
								: addToCart(productData, quantity, user && user.uid)
						}
					>
						<ShoppingCartOutlined />
						{user && user.cart && itemInCart ? 'Update Cart' : 'Add to Cart'}
					</Button>
				</Row>
			</Card>
		</Badge>
	);
}
