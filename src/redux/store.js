
import { applyMiddleware, createStore } from "redux";
import reducer from "./reducers";
import { save, load } from "redux-localstorage-simple";
import { session } from "../utils/uti";


const createStoreWithMiddleware = applyMiddleware(
	save({ states: ["ofertas"] })
)(createStore);

const store = createStoreWithMiddleware(
	reducer,
	load({
		preloadedState:{

			isLoggedIn: !!session.get(),
			
			lostPass: "",
			ofertasResultado:"",
			ofertasResultadoEmpresa:"",
			
		},
		states: ["ofertas"] }),
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;

