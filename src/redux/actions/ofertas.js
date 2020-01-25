import store from "../store"

export const rdx_ofertasResultado = (ofertasResultado) => {
	store.dispatch({
		type: 'OFERTA_SEARCH',
		payload: ofertasResultado
	})
};

