import { Button, Card, Col, Image, InputNumber, Row, Typography } from 'antd';
import ClientCarousel from '@/components/shared/ClientCarousel';
import { HeartFilled, HeartOutlined, ShareAltOutlined, SnippetsOutlined } from '@ant-design/icons';
import { useUser } from '@/context/userContext';
import { favoriteSet } from '@/utils/sharedFunctions';

const { Text, Title } = Typography;

export default function pdMainCard({ productData }) {
	const { user } = useUser();

	const isFavorite = user.favorites.some((item) => item === productData.pid);

	const urlsArray =
		productData && productData.images
			? productData.images.map((image) => image.url)
			: ['/images/600px-No_image_available.png'];

	return (
		<Card style={{ height: '350px' }}>
			<Row justify="space-between">
				<Col lg={9}>
					<ClientCarousel urls={urlsArray} width={250} height={250} arrowSize="3rem" />
				</Col>
				<Col lg={14}>
					<Row>
						<Col>
							<Row justify="end">
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
									>
										Favorite
									</Button>
								</Col>
								<Col>
									<Button type="link" icon={<SnippetsOutlined style={{ fontSize: '1.3rem' }} />}>
										Add to List
									</Button>
								</Col>
								<Col>
									<Button type="link" icon={<ShareAltOutlined style={{ fontSize: '1.3rem' }} />}>
										Share
									</Button>
								</Col>
							</Row>
							<Row>
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
