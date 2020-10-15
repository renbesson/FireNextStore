import { useState, useContext } from 'react';
import { useUser } from '@/context/userContext';
import MyAccountLayout from '@pages/myAccount/MyAccountLayout';
import { Button, Card, Col, Row, Typography } from 'antd';
import EditAddressDrawer from '@pages/myAccount/addresses/EditAddressDrawer';
import { HomeTwoTone, PlusCircleTwoTone } from '@ant-design/icons';
import { Context } from '@/context/storeContext';

const { Title, Text } = Typography;

export default function account() {
	const { loadingUser, user } = useUser();
	const [newAddressDrawerOn, setNewAddressDrawerOn] = useState(false);
	const [editAddressDrawerOn, setEditAddressDrawerOn] = useState(false);
	const [editedAddress, setEditedAddress] = useState({});
	const [state, dispatch] = useContext(Context);

	const selectAddress = async (value) => {
		await setEditedAddress(user.addresses.find((item) => item.addressNickname === value));
		dispatch({ type: 'TOGGLE_BOOLEAN', boolean: 'editAddressDrawerOn' });
	};

	return (
		<MyAccountLayout>
			<EditAddressDrawer address={editedAddress} />
			<Row>
				<Col>
					<Title level={3}>Addresses</Title>
				</Col>
			</Row>
			<Row justify="space-around">
				<Col>
					<Card
						hoverable
						style={{ width: 200, height: 200, textAlign: 'center' }}
						cover={
							<PlusCircleTwoTone
								style={{
									fontSize: '5rem',
									margin: 'auto',
									paddingTop: '20px',
									paddingBottom: '10px',
								}}
								twoToneColor="#ec3237"
							/>
						}
						bodyStyle={{ padding: 0 }}
						onClick={() => dispatch({ type: 'TOGGLE_BOOLEAN', boolean: 'newAddressDrawerOn' })}
					>
						<Title level={4}>New Address</Title>
					</Card>
				</Col>
				{user &&
					user.addresses &&
					user.addresses.map((address) => {
						return (
							<Col key={address.addressNickname}>
								<Card
									hoverable
									style={{ width: 200, height: 200, textAlign: 'center' }}
									cover={
										<HomeTwoTone
											style={{
												fontSize: '5rem',
												margin: 'auto',
												paddingTop: '20px',
												paddingBottom: '10px',
											}}
											twoToneColor="#ec3237"
										/>
									}
									bodyStyle={{ padding: 0 }}
									onClick={() => selectAddress(address.addressNickname)}
								>
									<Title level={4}>{address.addressNickname}</Title>
									<Text>{`${address.streetAddress}, ${address.city}, ${address.postalCode}`}</Text>
								</Card>
							</Col>
						);
					})}
			</Row>
		</MyAccountLayout>
	);
}
