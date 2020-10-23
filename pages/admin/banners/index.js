import { CloseCircleTwoTone } from '@ant-design/icons';
import UploadImage from '@components/admin/products/UploadImage';
import { useDocument } from '@nandorojo/swr-firestore';
import { deleteImage } from '@utils/sharedFunctions';
import { Card } from 'antd';

indexBannersAdmin.AdminLayout = true;

export default function indexBannersAdmin() {
	const { data: banners, error } = useDocument('misc/banners', { listen: true });

	const imgStyle = {
		display: 'table',
		float: 'left',
		width: '500px',
		height: '200px',
		marginRight: '8px',
		marginBottom: '8px',
		textAlign: 'center',
		verticalAlign: 'top',
		backgroundColor: '#fafafa',
		border: '1px dashed #d9d9d9',
		borderRadius: '2px',
		transition: 'border-color 0.3s ease',
	};

	const Images = () => {
		if (banners) {
			return banners.mainBanners.map((image) => (
				<Card
					bodyStyle={{ padding: 0 }}
					style={imgStyle}
					key={image.fileName}
					cover={<img src={image.url} style={{ padding: 1 }} />}
				>
					<CloseCircleTwoTone
						style={{ position: 'absolute', right: 0, top: 0, fontSize: '1.4rem' }}
						onClick={() =>
							deleteImage('misc', `misc/banners/mainBanners/`, image, 'banners', 'mainBanners')
						}
					/>
				</Card>
			));
		} else return <></>;
	};

	return (
		<div>
			<Images />
			<UploadImage
				aspect={2.5}
				collection={'misc'}
				path={`misc/banners/mainBanners/`}
				docId={'banners'}
				array={'mainBanners'}
			/>
		</div>
	);
}
