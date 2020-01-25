
const reducer = (
	
	state = {
		lostPass: "",
		ofertasResultado: "",
	},
	action
	
) => {
	
	switch (action.type) {
		
		case "LOGIN":
		return {
			...state,
			isLoggedIn: action.payload
		};

		case "PASSWORD":
		return {
			...state,
			lostPass: action.payload
		}

		case "OFERTA_SEARCH":
		return {
			...state,
			ofertasResultado: action.payload
		}
		
		default:
		return state;
		
	};
	
};


export default reducer;
