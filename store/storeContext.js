import React, { createContext, useReducer } from 'react';
import Reducer from './Reducer';

const initialState = {
	posts: [],
	error: null,
};

const storeContext = ({ children }) => {
	const [state, dispatch] = useReducer(Reducer, initialState);
	return <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>;
};

export const Context = createContext(initialState);
export default storeContext;
