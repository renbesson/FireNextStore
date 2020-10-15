const Reducer = (state, action) => {
	switch (action.type) {
		case 'TOGGLE_BOOLEAN':
			return {
				...state,
				[action.boolean]: !state[action.boolean],
			};
		case 'SET_ITEM':
			return {
				...state,
				products: action.payload,
			};
		case 'ADD_ITEM':
			console.log(action);
			return {
				...state,
				products: state.products.concat(action.product),
			};
		case 'REMOVE_ITEM':
			return {
				...state,
				products: state.products.filter((item) => item.id !== action.payload),
			};
		case 'SET_ERROR':
			return {
				...state,
				error: action.payload,
			};
		default:
			return state;
	}
};

export default Reducer;
