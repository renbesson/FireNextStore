import BestDeals from '@components/BestDeals';
import ImageGallery from 'react-image-gallery';
import MiddleCards from '@components/MiddleCards';
import NewsLetterGet from '@components/NewsLetterGet';
import { Col, Row } from 'antd';

export default function Home() {
	const urls = [
		{ original: '/images/carousel1.png' },
		{ original: '/images/carousel2.png' },
		{ original: '/images/carousel3.png' },
	];
	return (
		<>
			<Row gutter={[24, 24]} justify="space-between">
				<Col span={24}>
					<ImageGallery
						items={urls}
						showThumbnails={false}
						autoPlay
						infinite
						showPlayButton={false}
						showBullets
					/>
				</Col>
				<Col span={24}>
					<MiddleCards />
				</Col>
				<Col span={24}>
					<BestDeals />
				</Col>
				<Col span={24}>
					<NewsLetterGet />
				</Col>
			</Row>
		</>
	);
}
