import { useState } from 'react';
import { useRouter } from 'next/router';
import firebase from '@/firebase/clientApp';
import { useUser } from '@/context/userContext';
import { useDocument } from '@nandorojo/swr-firestore';
import { Row, Col, Card, InputNumber, Button, Typography, Badge, notification } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';


        export const addToCart = (product, uid) => {


        let hasError = false;
        let hasChange = false;
        try {
            //when the product is not in the cart
            await firebase.firestore().collection(`users/${uid}`).update({
                cart: firebase.firestore.FieldValue.arrayUnion({
                    pid: product.pid,
                    quantity,
                }),
            });
            hasChange = true;
        } catch (error) {
            notification.error({
                message: 'Error Adding To Cart',
                description: `${error}`,
            });
            hasError = true;
        } finally {
            if (!hasError && hasChange) {
                notification.success({
                    message: 'Product Successfully Added',
                    description: `Product "${product.title}" has been successfully added to the cart.`,
                });
            }
                    }
    return 'success'
}
