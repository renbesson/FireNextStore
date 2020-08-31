import { useRef } from 'react';
import { Row, Col, Typography, Layout, Carousel, Button } from 'antd';
import { LeftCircleTwoTone, RightCircleTwoTone } from '@ant-design/icons';
import ProductCardSample from '@/components/ProductCardSample';

const { Title } = Typography;

const leftArrow = {
	position: 'absolute',
	zIndex: '1000',
	left: '-24px',
	top: '45%',
	fontSize: '4rem',
};

const rightArrow = {
	position: 'absolute',
	zIndex: '1000',
	right: '-24px',
	top: '45%',
	fontSize: '4rem',
};

export default function BestDeals() {
	const carouselRef = useRef(null);
	return (
		<>
			<Row>
				<Col>
					<Title>Best Deals</Title>
				</Col>
			</Row>
			<Row>
				<Col>
					<LeftCircleTwoTone
						twoToneColor="#cccccc"
						style={leftArrow}
						onClick={() => carouselRef.current.prev()}
					/>
					<RightCircleTwoTone
						twoToneColor="#cccccc"
						style={rightArrow}
						onClick={() => carouselRef.current.next()}
					/>
					<Carousel ref={carouselRef} autoplay>
						<div>
							<Row justify="space-around" align="middle" style={{ padding: '16px 0' }}>
								<Col>
									<ProductCardSample />
								</Col>
								<Col>
									<ProductCardSample />
								</Col>
								<Col>
									<ProductCardSample />
								</Col>
								<Col>
									<ProductCardSample />
								</Col>
							</Row>
						</div>
						<div>
							<Row justify="space-around" align="middle" style={{ padding: '16px 0' }}>
								<Col>
									<ProductCardSample />
								</Col>
								<Col>
									<ProductCardSample />
								</Col>
								<Col>
									<ProductCardSample />
								</Col>
								<Col>
									<ProductCardSample />
								</Col>
							</Row>
						</div>
					</Carousel>
				</Col>
			</Row>
		</>
	);
}
