import { useEffect, useState } from 'react';
import { useUser } from '@/context/userContext';
import MyAccountLayout from '@pages/myAccount/MyAccountLayout';
import { Button, Card, Col, Row, Typography } from 'antd';
import NewAddressDrawer from '@pages/myAccount/addresses/NewAddressDrawer';
import EditAddressDrawer from '@pages/myAccount/addresses/EditAddressDrawer';
import { HomeTwoTone, PlusCircleTwoTone } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function account() {
	const { loadingUser, user } = useUser();
	const [newAddressDrawerOn, setNewAddressDrawerOn] = useState(false);
	const [editAddressDrawerOn, setEditAddressDrawerOn] = useState(false);
	const [editedAddress, setEditedAddress] = useState({});

	const selectAddress = async (value) => {
		await setEditedAddress(user.addresses.find((item) => item.addressNickname === value));
		await setEditAddressDrawerOn(true);
	};

	return (
		<MyAccountLayout>
			<NewAddressDrawer drawerOn={newAddressDrawerOn} setDrawerOn={setNewAddressDrawerOn} />
			<EditAddressDrawer
				drawerOn={editAddressDrawerOn}
				setDrawerOn={setEditAddressDrawerOn}
				address={editedAddress}
			/>
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
						onClick={() => setNewAddressDrawerOn(true)}
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
