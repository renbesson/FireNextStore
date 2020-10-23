import firebase from '@/firebase/clientApp';
import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@/context/userContext';
import { useDocument } from '@nandorojo/swr-firestore';
import { Row, Col, Card, InputNumber, Button, Typography, Badge, notification } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Context } from '@/context/storeContext';

export const addToCart = async (product, quantity, uid) => {
	const userRef = firebase.firestore().doc(`users/${uid}`);

	let hasError = false;
	try {
		//when the product is not in the cart
		await userRef.update({
			cart: firebase.firestore.FieldValue.arrayUnion({
				pid: product.pid,
				quantity,
			}),
		});
	} catch (error) {
		notification.error({
			message: 'Error Adding To Cart',
			description: `${error.message}`,
		});
		hasError = true;
	} finally {
		if (!hasError) {
			notification.success({
				message: 'Product Successfully Added',
				description: `Product "${product.title}" has been successfully added to the cart.`,
			});
		}
	}
};

export const updateToCart = async (product, oldQuantity, newQuantity, uid) => {
	const userRef = firebase.firestore().doc(`users/${uid}`);

	if (oldQuantity !== newQuantity) {
		let hasError = false;
		try {
			await userRef.update({
				cart: firebase.firestore.FieldValue.arrayRemove({
					pid: product.pid,
					quantity: oldQuantity,
				}),
			});
			await userRef.update({
				cart: firebase.firestore.FieldValue.arrayUnion({
					pid: product.pid,
					quantity: newQuantity,
				}),
			});
		} catch (error) {
			notification.error({
				message: 'Error Editing Cart',
				description: `${error.message}`,
			});
			hasError = true;
		} finally {
			if (!hasError) {
				notification.success({
					message: 'Product Successfully Updated',
					description: `Product "${product.title}" has been successfully updated to the cart.`,
				});
			}
		}
	} else {
		notification.warning({
			message: 'Product Already in the Cart',
			description: `Product "${product.title}" is already in the cart with this quantity.`,
		});
	}
};

export const removeFromCart = (product, itemInCart, uid) => {
	try {
		const userRef = firebase.firestore().doc(`users/${uid}`);
		userRef
			.update({
				cart: firebase.firestore.FieldValue.arrayRemove(itemInCart),
			})
			.then(() => {
				notification.success({
					message: 'Cart Updated Successfully',
					description: `Product "${product.title}" has been successfully removed from the cart.`,
				});
			});
	} catch (error) {
		notification.error({
			message: 'Cart Not Updated',
			description: `${error}`,
		});
	}
};

export const favoriteSet = (product, isFavorite, uid) => {
	const userRef = firebase.firestore().doc(`users/${uid}`);
	if (isFavorite) {
		try {
			userRef
				.update({
					favorites: firebase.firestore.FieldValue.arrayRemove(product.pid),
				})
				.then(() => {
					notification.success({
						message: 'Product Unfavorited Successfully',
						description: `Product "${product.title}" has been successfully removed from the favorites.`,
					});
				});
		} catch (error) {
			notification.error({
				message: 'Cart Not Updated',
				description: `${error}`,
			});
		}
	} else {
		try {
			userRef
				.update({
					favorites: firebase.firestore.FieldValue.arrayUnion(product.pid),
				})
				.then(() => {
					notification.success({
						message: 'Product Favorited Successfully',
						description: `Product "${product.title}" has been successfully added to the favorites.`,
					});
				});
		} catch (error) {
			notification.error({
				message: 'Cart Not Updated',
				description: `${error}`,
			});
		}
	}
};

export const deleteImage = async (collection, path, imageInfo, docId, array) => {
	const refProducts = firebase.firestore().collection(collection);
	const refImages = firebase.storage().ref();
	let hasError = null;
	try {
		refImages
			.child(`${path}${imageInfo.fileName}`)
			.delete()
			.then(() => {
				refProducts.doc(docId).update({
					[array]: firebase.firestore.FieldValue.arrayRemove(imageInfo),
				});
			});
	} catch (error) {
		notification.error({
			message: 'Error Deleting Image',
			description: `${error.message}`,
		});
		console.error(error);
		hasError = true;
	} finally {
		if (!hasError) {
			notification.success({
				message: 'Image Deleted Successfully',
				description: `Image "${imageInfo.fileName}" has been deleted successfully.`,
			});
		}
	}
};
