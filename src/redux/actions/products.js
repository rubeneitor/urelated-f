import store from "../store"


export const rdx_productDetail = (productData) => {
    store.dispatch({
		type: 'PRODUCT_DETAIL',
		payload: productData
	})
};


export const rdx_productSearchResults = (productSearchResults) => {
    store.dispatch({
		type: 'PRODUCT_SEARCH',
		payload: productSearchResults
	})
};



export const rdx_cartAdd = (product) => {
    store.dispatch({
		type: 'CART_ADD',
		payload: product
	})
};
export const rdx_cartRemove = (product) => {
    store.dispatch({
		type: 'CART_REMOVE',
		payload: product
	})
};
export const rdx_cartEdit = (product) => {
    store.dispatch({
		type: 'CART_EDIT',
		payload: product
	})
};

