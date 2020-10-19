import { Button, Card, Col, Image, InputNumber, Row, Typography } from 'antd';
import ClientCarousel from '@/components/shared/ClientCarousel';
import { HeartFilled, HeartOutlined, ShareAltOutlined, SnippetsOutlined } from '@ant-design/icons';
import { useUser } from '@/context/userContext';
import { favoriteSet } from '@/utils/sharedFunctions';
import ImageGallery from 'react-image-gallery';

const { Text, Title } = Typography;

export default function pdMainCard({ productData }) {
	const { user } = useUser();

	const isFavorite = user.favorites.some((item) => item === productData.pid);

	const urlsArray =
		productData && productData.images
			? productData.images.map((image) => {
					return {
						original: image.url,
						thumbnail: image.url,
					};
			  })
			: ['/images/600px-No_image_available.png'];

	return (
		<Card>
			<Row justify="space-between" gutter={[20, 20]}>
				<Col xs={24} lg={10}>
					<ImageGallery
						items={urlsArray}
						autoPlay
						infinite
						showPlayButton={false}
						showBullets
						showFullscreenButton={false}
						showNav={false}
					/>
				</Col>
				<Col xs={24} lg={14}>
					<Row gutter={[20, 20]}>
						<Col>
							<Row justify="space-between" gutter={[20, 20]}>
								<Col xs={8}>
									<Button
										onClick={() => favoriteSet(productData, isFavorite, user && user.uid)}
										type="link"
										icon={
											isFavorite ? (
												<HeartFilled style={{ fontSize: '2rem', color: 'red' }} />
											) : (
												<HeartOutlined style={{ fontSize: '2rem', color: 'red' }} />
											)
										}
									>
										Favorite
									</Button>
								</Col>
								<Col xs={8}>
									<Button
										type="link"
										icon={<SnippetsOutlined style={{ fontSize: '2rem', color: 'red' }} />}
									>
										Add to List
									</Button>
								</Col>
								<Col xs={8}>
									<Button
										type="link"
										icon={<ShareAltOutlined style={{ fontSize: '2rem', color: 'red' }} />}
									>
										Share
									</Button>
								</Col>
							</Row>
							<Row gutter={[20, 20]}>
								<Col>
									<Title level={3}>{productData.title}</Title>
								</Col>
							</Row>
						</Col>
					</Row>
				</Col>
			</Row>
		</Card>
	);
}
