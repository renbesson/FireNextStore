import { useRef } from 'react';
import { Row, Col, Carousel, Image } from 'antd';
import { LeftCircleTwoTone, RightCircleTwoTone } from '@ant-design/icons';

export default function MainCarousel({ autoplay, urls, width, height, arrowSize }) {
	const carouselRef = useRef(null);

	const contentStyle = {
		width: width ? width : '100%',
		height: height ? height : '100%',
		color: '#fff',
		textAlign: 'center',
		background: '#364d79',
	};

	const leftArrow = {
		position: 'absolute',
		zIndex: '1000',
		left: '-24px',
		top: '45%',
		fontSize: arrowSize ? arrowSize : '4rem',
	};

	const rightArrow = {
		position: 'absolute',
		zIndex: '1000',
		right: '-24px',
		top: '45%',
		fontSize: arrowSize ? arrowSize : '4rem',
	};

	if (!(urls instanceof Array)) {
		return <h3>urls is not an array</h3>;
	}

	return (
		<div style={{ position: 'relative' }}>
			{urls.length > 1 && (
				<LeftCircleTwoTone
					twoToneColor="#cccccc"
					fill="blue"
					style={leftArrow}
					onClick={() => carouselRef.current.prev()}
				/>
			)}
			{urls.length > 1 && (
				<RightCircleTwoTone
					twoToneColor="#cccccc"
					style={rightArrow}
					onClick={() => carouselRef.current.next()}
				/>
			)}
			<Carousel ref={carouselRef} autoplay={autoplay} autoplaySpeed={2500}>
				{urls.map((url) => {
					return (
						<div key={url}>
							<Image src={url} style={{ cursor: 'pointer' }} />
						</div>
					);
				})}
			</Carousel>
		</div>
	);
}
