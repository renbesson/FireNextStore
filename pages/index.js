import { Form, Select, InputNumber, Switch, Slider, Button, Carousel } from 'antd';
import { Typography, Layout, Menu, Breadcrumb, Row, Col } from 'antd';
import ProductCard from '@/components/ProductCard';
import BestDeals from '@components/BestDeals';
import MainCarousel from '@components/MainCarousel';
import MiddleCards from '@components/MiddleCards';

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;



export default function Home() {
	return (
		<>
			<MainCarousel />
			<MiddleCards />
			<BestDeals />
		</>
	);
}
