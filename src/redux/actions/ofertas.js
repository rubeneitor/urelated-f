import store from "../store"

export const rdx_ofertasResultado = (ofertasResultado) => {
	store.dispatch({
		type: 'OFERTA_SEARCH',
		payload: ofertasResultado
	})
};

export const rdx_ofertasResultadoEmpresa = (ofertasResultadoEmpresa) => {
	store.dispatch({
		type: 'OFERTA_SEARCH_EMPRESA',
		payload: ofertasResultadoEmpresa
	})
};

