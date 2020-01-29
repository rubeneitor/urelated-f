
const reducer = (
	
	state = {
		lostPass: "",
		ofertasResultado: "",
		ofertasResultadoEmpresa: "",
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

		case "OFERTA_SEARCH_EMPRESA":
		return {
			...state,
			ofertasResultadoEmpresa: action.payload
		}
		
		default:
		return state;
		
	};
	
};


export default reducer;
