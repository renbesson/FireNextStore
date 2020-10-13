import firebase from '@/firebase/clientApp';
import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@/context/userContext';
import { useDocument } from '@nandorojo/swr-firestore';
import { Row, Col, Card, InputNumber, Button, Typography, Badge, notification } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Context } from '@/context/storeContext';

export const addToCart = async (product, quantity, uid, dispatch) => {
	if (uid) {
		let hasError = false;
		try {
			//when the product is not in the cart
			await firebase
				.firestore()
				.doc(`users/${uid}`)
				.update({
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
	} else {
		dispatch({ type: 'ADD_ITEM', product });
		const localStorageCart = JSON.parse(localStorage.getItem('cart'));
		const alreadyInCart = localStorageCart && localStorageCart.find(({ pid }) => pid === product.pid);

		if (!alreadyInCart) {
			localStorage.setItem(
				'cart',
				JSON.stringify([
					...(localStorageCart ? localStorageCart : []),
					{
						pid: product.pid,
						quantity,
					},
				])
			);
		}
	}
};

export const updateToCart = async (product, quantity, uid) => {};
