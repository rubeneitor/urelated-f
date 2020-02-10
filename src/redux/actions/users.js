import store from "../store"


export const login = (isLoggedIn) => {
    store.dispatch({
		type: 'LOGIN',
		payload: isLoggedIn
	})
};

