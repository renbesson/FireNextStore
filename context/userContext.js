import firebase from '@/firebase/clientApp';
import { useState, useEffect, createContext, useContext } from 'react';
export const UserContext = createContext();

export default function UserContextComp({ children }) {
	const [user, setUser] = useState(null);
	const [loadingUser, setLoadingUser] = useState(true); // Helpful, to update the UI accordingly.

	useEffect(() => {
		// Listen authenticated user
		const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
			try {
				if (user) {
					// User is signed in.
					const { uid, displayName, email, photoURL } = user;
					// You could also look for the user doc in your Firestore (if you have one):
					firebase
						.firestore()
						.doc(`users/${uid}`)
						.onSnapshot((doc) => {
							setUser((prevUser) => {
								return { ...prevUser, ...doc.data() };
							});
						});
					setUser((prevUser) => {
						return { ...prevUser, uid, displayName, email, photoURL };
					});
				} else setUser(null);
			} catch (error) {
				// Most probably a connection error. Handle appropriately.
				console.error(error);
			} finally {
				setLoadingUser(false);
			}
		});

		// Unsubscribe auth listener on unmount
		return () => unsubscribe();
	}, []);

	return <UserContext.Provider value={{ user, setUser, loadingUser }}>{children}</UserContext.Provider>;
}

// Custom hook that shorhands the context!
export const useUser = () => useContext(UserContext);
