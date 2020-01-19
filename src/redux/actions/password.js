import store from "../store"


export const login = (lostPass) => {
    store.dispatch({
		type: 'PASSWORD',
		payload: lostPass
	})
};
