import { useState } from 'react';
import firebase from '@/firebase/clientApp';
import { useUser } from '@/context/userContext';
import { useDocument } from '@nandorojo/swr-firestore';
import { Button, Card, Col, Divider, Input, InputNumber, notification, Row, Typography } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import NumberFormat from 'react-number-format';
import { addToCart, updateToCart } from '@/utils/sharedFunctions';

const { Text, Title } = Typography;

export default function PdDescription({ productData }) {
	return (
		<Card style={{ minHeight: '350px', marginTop: '48px', marginBottom: '48px' }}>
			<Row>
				<Title level={2}>Description</Title>
			</Row>
		</Card>
	);
}
