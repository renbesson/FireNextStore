import { useEffect, useState } from 'react';
import { useUser } from '@/context/userContext';
import MyAccountLayout from '@pages/myAccount/MyAccountLayout';
import { Button, Card, Col, Row } from 'antd';
import NewAddressDrawer from '@pages/myAccount/addresses/NewAddressDrawer';
import EditAddressDrawer from '@pages/myAccount/addresses/EditAddressDrawer';
import { PlusCircleTwoTone } from '@ant-design/icons';

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
			<Row justify="space-around">
				<Col>
					<Button onClick={() => setNewAddressDrawerOn(true)}>New Address</Button>
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
										<PlusCircleTwoTone
											style={{
												fontSize: '5rem',
												margin: 'auto',
												paddingTop: '50px',
												paddingBottom: '50px',
											}}
											twoToneColor="#ec3237"
										/>
									}
									bodyStyle={{ padding: 0 }}
									onClick={() => selectAddress(address.addressNickname)}
								>
									{address.addressNickname}
								</Card>
							</Col>
						);
					})}
			</Row>
		</MyAccountLayout>
	);
}
