import { useRef } from 'react';
import { Row, Col, Carousel, Button } from 'antd';
import { LeftCircleTwoTone, RightCircleTwoTone } from '@ant-design/icons';

const contentStyle = {
	width: '100%',
	color: '#fff',
	textAlign: 'center',
	background: '#364d79',
};

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

export default function MainCarousel() {
	const carouselRef = useRef(null);

	return (
		<Row>
			<Col>
				<LeftCircleTwoTone
					twoToneColor="#cccccc"
					fill="blue"
					style={leftArrow}
					onClick={() => carouselRef.current.prev()}
				/>
				<RightCircleTwoTone
					twoToneColor="#cccccc"
					style={rightArrow}
					onClick={() => carouselRef.current.next()}
				/>
				<Carousel ref={carouselRef} autoplay autoplaySpeed={2500}>
					<div>
						<img style={contentStyle} src="/images/carousel1.png" />
					</div>
					<div>
						<img style={contentStyle} src="/images/carousel2.png" />
					</div>
					<div>
						<img style={contentStyle} src="/images/carousel3.png" />
					</div>
				</Carousel>
			</Col>
		</Row>
	);
}
