import { useShoppingCart } from 'use-shopping-cart';
import { useUser } from '@/context/userContext';

export default function CheckoutButton() {
	const { cartDetails } = useShoppingCart();
	const { user } = useUser();

	

	return <button onClick={handler}>Checkout222</button>;
}
