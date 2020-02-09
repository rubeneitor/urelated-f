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

/*

engine de búsqueda dinámico con filtro. función asincrona que recibe por parámetro (null por defecto) 
los distintos filtros de búsqueda.

se hace la llamada de axios (línea : 32) con todos los parámetros y el resultado se guarda en el store de redux en 
GET_OFERTAS_FILTRADAS, de este modo, con llamar a esta función buscamos con filtro y almacenamos acto seguido.

la función asincrona espera siempre a recibir el resultado del axios y posteriormente hace el store.dispatch,
llevando así un orden de los tiempos.

*/
export const getOfertasFiltradas = async (puesto="",lugar="",salario="",experiencia="",jornada="",keyWord="") =>{
	const res = await axios.get(getUrl(`/searchHome?puesto=${puesto}&lugar=${lugar}&salario=${salario}&experiencia=${experiencia}&jornada=${jornada}&keyWord=${keyWord}`));
	store.dispatch({
		type:'GET_OFERTAS_FILTRADAS',
		payload: res.data
	})
	return res.data;
}