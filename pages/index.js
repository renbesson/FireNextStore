import BestDeals from '@components/BestDeals';
import ClientCarousel from '@components/shared/ClientCarousel';
import MiddleCards from '@components/MiddleCards';

export default function Home() {
	const urls = ['/images/carousel1.png', '/images/carousel2.png', '/images/carousel3.png'];
	return (
		<>
			<ClientCarousel urls={urls} width="100%" />
			<MiddleCards />
			<BestDeals />
		</>
	);
}
