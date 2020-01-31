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



export const getOfertasFiltradas = async (puesto="",lugar="",salario="",experiencia="",jornada="") =>{
	const res = await axios.get(getUrl(`/searchHome?puesto=${puesto}&lugar=${lugar}&salario=${salario}&experiencia=${experiencia}&jornada=${jornada}`));
	store.dispatch({
		type:'GET_OFERTAS_FILTRADAS',
		payload: res.data
	})
	return res.data;
}