import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import firebase from '@/firebase/clientApp';
import { useUser } from '@/context/userContext';
import { Row, Col, Card, InputNumber, Button, Typography, Badge, notification, Image } from 'antd';
import { ConsoleSqlOutlined, HeartFilled, HeartOutlined, HeartTwoTone, ShoppingCartOutlined } from '@ant-design/icons';
import { addToCart, favoriteSet, updateToCart } from '@/utils/sharedFunctions';
import { useShoppingCart } from 'use-shopping-cart';

const { Title, Text, Paragraph } = Typography;

export default function ProductCard({ productData }) {
	const router = useRouter();
	const { user } = useUser();
	const [quantity, setQuantity] = useState(1);
	const { addItem, setItemQuantity, cartDetails } = useShoppingCart();

	const itemInCart = cartDetails[productData.sku];
	const isFavorite = user && user.favorites && user.favorites.some((item) => item === productData.sku);

	return (
		<Badge
			offset={[-19, 19]}
			style={{
				width: '35px',
				height: '35px',
				fontWeight: 'bold',
				borderRadius: '5px',
				lineHeight: '35px',
				paddingLeft: '3px',
			}}
			count={`-${parseInt(((productData.priceBase - productData.priceCurrent) / productData.priceBase) * 100)}%`}
		>
			<Card hoverable style={{ width: 212 }} bodyStyle={{ padding: '1rem' }}>
				<Button
					style={{ position: 'absolute', left: 0, top: 0, zIndex: 1 }}
					onClick={() => favoriteSet(productData, isFavorite, user && user.uid)}
					type="link"
					icon={
						isFavorite ? (
							<HeartFilled style={{ fontSize: '2rem', color: 'red' }} />
						) : (
							<HeartOutlined style={{ fontSize: '2rem', color: 'red' }} />
						)
					}
				></Button>
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
							onClick={() => router.push(`/pd/${productData.sku}`)}
						/>
					</Col>
				</Row>
				<Row>
					<Paragraph ellipsis={{ rows: 2 }} style={{ height: 44 }}>
						{productData.name}
					</Paragraph>
				</Row>
				<Row justify="space-between">
					<Col span={10} className={'m-0'}>
						<Title level={4}>
							{new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(
								productData.priceCurrent
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
					<Col span={6}>
						<Button
							color="red-6"
							type="primary"
							onClick={() =>
								itemInCart
									? itemInCart && itemInCart.quantity === quantity
										? notification.warning({
												message: 'Product Already in the Cart',
												description: `Product "${productData.name}" is already in the cart with this quantity.`,
										  })
										: setItemQuantity(productData.sku, quantity)
									: addItem(productData, quantity)
							}
						>
							<ShoppingCartOutlined />
						</Button>
					</Col>
				</Row>
			</Card>
		</Badge>
	);
}
