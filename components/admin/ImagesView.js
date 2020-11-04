import { CloseCircleTwoTone } from '@ant-design/icons';
import { Card, Image } from 'antd';

import { deleteImage } from '@utils/sharedFunctions';

export default function ImagesView({ collection, path, docId, array, images, width, height }) {
	const imgStyle = {
		display: 'table',
		float: 'left',
		width: width ? width : '500px',
		height: height ? height : '200px',
		marginRight: '8px',
		marginBottom: '8px',
		textAlign: 'center',
		verticalAlign: 'top',
		backgroundColor: '#fafafa',
		border: '1px dashed #d9d9d9',
		borderRadius: '2px',
		transition: 'border-color 0.3s ease',
	};

	return images.map((image) => (
		<Card
			bodyStyle={{ padding: 0 }}
			style={imgStyle}
			key={image.fileName}
			cover={<Image src={image.url} style={{ padding: '10px', cursor: 'pointer' }} />}
		>
			<CloseCircleTwoTone
				style={{ position: 'absolute', right: 0, top: 0, fontSize: '2rem' }}
				onClick={() => deleteImage(collection, path, image, docId, array)}
			/>
		</Card>
	));
}
