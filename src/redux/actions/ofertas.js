import store from "../store"
import axios from "axios";
import { getUrl } from "../../utils/uti";

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

export const rdx_homeSearch = (homeSearch) => {
	store.dispatch({
		type: 'HOME_SEARCH',
		payload: homeSearch
	})
};

export const getOfertasFiltradas = async (puesto="",lugar="") =>{
	const res = await axios.get(getUrl(`/searchHome?puesto=${puesto}&lugar=${lugar}`));
	store.dispatch({
		type:'GET_OFERTAS_FILTRADAS',
		payload: res.data
	})
	return res.data;
}