import React, { createContext, useReducer } from 'react';
import Reducer from '@/context/Reducer';

const initialState = {
	products: [],
	product: {},
	error: null,
};

const StoreContext = ({ children }) => {
	const [state, dispatch] = useReducer(Reducer, initialState);
	return <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>;
};

export const Context = createContext(initialState);
export default StoreContext;
