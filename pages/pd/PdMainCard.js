import { Button, Card, Col, Image, InputNumber, Row, Typography } from 'antd';
import ClientCarousel from '@/components/shared/ClientCarousel';
import { HeartOutlined, ShareAltOutlined, SnippetsOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

export default function pdMainCard({ productData }) {
	const urlsArray =
		productData && productData.images
			? productData.images.map((image) => image.url)
			: ['/images/600px-No_image_available.png'];

	return (
		<Card style={{ minHeight: '350px' }}>
			<Row>
				<Col>
					<Button type="link" icon={<HeartOutlined style={{ fontSize: '1.3rem' }} />}>
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
			<Row justify="space-between">
				<Col lg={8}>
					<ClientCarousel urls={urlsArray} width={250} height={250} arrowSize="3rem" />
				</Col>
				<Col lg={14}>
					<Row>
						<Col>
							<Title level={2}>{productData.title}</Title>
						</Col>
					</Row>
				</Col>
			</Row>
		</Card>
	);
}
