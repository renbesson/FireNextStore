import { Button, Card, Col, Input, Row, Typography } from 'antd';
import React from 'react';

const { Text, Title } = Typography;

const root = {
	backgroundColor: 'rgb(45, 85, 150)',
	minHeight: '100px',
	width: '100%',

	borderRadius: '5px',
};

export default function newsLetterGet() {
	return (
		<Card style={root}>
			<Row justify="center">
				<Col>
					<Text style={{ color: '#fff' }}>
						Tudo isso e muito mais! Cadastre seu e-mail para receber ofertas exclusivas!
					</Text>
				</Col>
			</Row>
			<Row justify="center">
				<Col xl={8} xs={16}>
					<Input />
				</Col>
				<Col span={8} style={{ paddingLeft: '15px' }}>
					<Button>Cadastrar</Button>
				</Col>
			</Row>
		</Card>
	);
}
