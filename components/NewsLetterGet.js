import { Button, Col, Input, Row, Typography } from 'antd';
import React from 'react';

const { Text, Title } = Typography;

const root = {
	backgroundColor: 'rgb(45, 85, 150)',
	height: '100px',
	width: '100%',
	padding: '15px 0',
	borderRadius: '5px',
};

export default function newsLetterGet() {
	return (
		<div style={root}>
			<Row justify="center">
				<Col>
					<Text style={{ color: '#fff' }}>
						Tudo isso e muito mais! Cadastre seu e-mail para receber ofertas exclusivas!
					</Text>
				</Col>
			</Row>
			<Row justify="center">
				<Col span={8}>
					<Input />
				</Col>
				<Col style={{ paddingLeft: '15px' }}>
					<Button>Cadastrar</Button>
				</Col>
			</Row>
		</div>
	);
}
