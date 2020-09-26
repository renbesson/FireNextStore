import firebase from '@/firebase/clientApp';
import { useUser } from '@/context/userContext';

export const AddToCart = async () => {
	const { user } = useUser();
	const refUsers = firebase.firestore().collection('users');

	// Error prevention case cart doesn't exist
	if (!user.cart) {
		await refUsers.doc(user.uid).update({
			cart: [],
		});
	}

	const itemInCart = await user.cart.find((item) => item.pid === pid);

	//when the product is not in the cart
	if (itemInCart !== undefined) {
		if (itemInCart.quantity !== quantity) {
			await refUsers.doc(user.uid).update({
				cart: firebase.firestore.FieldValue.arrayRemove(itemInCart),
			});
			await refUsers.doc(user.uid).update({
				cart: firebase.firestore.FieldValue.arrayUnion({
					pid,
					quantity,
				}),
			});
		}
	} else {
		await refUsers.doc(user.uid).update({
			cart: firebase.firestore.FieldValue.arrayUnion({
				pid,
				quantity,
			}),
		});
	}
};
