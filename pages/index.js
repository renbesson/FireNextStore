import BestDeals from '@components/BestDeals';
import ImageGallery from 'react-image-gallery';
import MiddleBanners from '@components/MiddleBanners';
import NewsLetterGet from '@components/NewsLetterGet';
import { Col, Row } from 'antd';
import { useDocument } from '@nandorojo/swr-firestore';

export default function Home() {
	const { data: banners } = useDocument('misc/banners');
	const urls = [
		{ original: '/images/carousel1.png' },
		{ original: '/images/carousel2.png' },
		{ original: '/images/carousel3.png' },
	];

	const mainBanners = banners && banners.mainBanners.map(({ url }) => ({ original: url }));

	return (
		<>
			<Row gutter={[24, 24]} justify="space-between">
				<Col span={24}>
					{banners && (
						<ImageGallery
							items={mainBanners}
							showThumbnails={false}
							autoPlay
							infinite
							showPlayButton={false}
							showBullets
							showFullscreenButton={false}
						/>
					)}
				</Col>
				<Col span={24}>{banners && <MiddleBanners middleBanners={banners.middleBanners} />}</Col>
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
