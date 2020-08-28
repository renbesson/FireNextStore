import BestDeals from '@components/BestDeals';
import MainCarousel from '@components/MainCarousel';
import MiddleCards from '@components/MiddleCards';

export default function Home() {
	return (
		<>
			<MainCarousel />
			<MiddleCards />
			<BestDeals />
		</>
	);
}
