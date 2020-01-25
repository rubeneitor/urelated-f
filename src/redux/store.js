
/*
import {createStore} from 'redux';
import reducer from './reducers';

const store = createStore(
	reducer,
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
*/


import { applyMiddleware, createStore } from "redux";
import reducer from "./reducers";
import { save, load } from "redux-localstorage-simple";


const createStoreWithMiddleware = applyMiddleware(
	save({ states: ["ofertas"] })
)(createStore);

const store = createStoreWithMiddleware(
	reducer,
	load({
		preloadedState:{
			
			lostPass: "",
			ofertasResultado:"",
			
		},
		states: ["ofertas"] }),
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;

