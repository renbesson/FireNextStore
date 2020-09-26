import { Button, Col, Row, Typography, Space } from 'antd';
import { FacebookFilled, InstagramFilled, TwitterSquareFilled } from '@ant-design/icons';
const { Text, Title } = Typography;

export default function ClientFooter() {
	return (
		<>
			<Row
				justify="space-around"
				style={{ backgroundColor: 'lightGray', borderTop: '2px solid gray', borderBottom: '2px solid gray' }}
			>
				<Col>
					<Button type="link">Central de atendimento (21) 3365-8155</Button>
				</Col>
				<Col>
					<Button type="link">Whatsapp (21) 9 7240-7680</Button>
				</Col>
				<Col>
					<Button type="link">Nossa Loja</Button>
				</Col>
				<Col>
					<Button type="link">Ajuda</Button>
				</Col>
			</Row>
			<Row justify="space-between" className={'px-5'}>
				<Col>
					<img style={{ height: '64px', padding: '10px' }} alt="Logo" src="/images/blank_64x64.png" />
				</Col>
				<Col>
					<Row>
						<Col>
							<Space>
								<Text>We accept the following cards: </Text>
								<img src="/images/acceptedCards.png" />
							</Space>
						</Col>
					</Row>
					<Row>
						<Col>
							<Text>
								Mercado Popular / CNPJ: XX.XXX.XXX/XXXX-XX / EndereçoÇ Rua Dez, 229 - Manguariba, RJ
							</Text>
						</Col>
					</Row>
					<Row>
						<Col>
							<Text>Desenvolvido por Monkey Developer</Text>
						</Col>
					</Row>
				</Col>
				<Col>
					<Row>
						<Col>
							<Text>Siga a gente!</Text>
						</Col>
					</Row>
					<Row>
						<Col>
							<FacebookFilled style={{ fontSize: '2rem' }} />
							<TwitterSquareFilled style={{ fontSize: '2rem' }} />
							<InstagramFilled style={{ fontSize: '2rem' }} />
						</Col>
					</Row>
				</Col>
			</Row>
		</>
	);
}
