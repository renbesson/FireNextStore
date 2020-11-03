const Reducer = (state, action) => {
	switch (action.type) {
		case 'TOGGLE_BOOLEAN':
			return {
				...state,
				[action.boolean]: !state[action.boolean],
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
