
// import React, { Fragment } from "react";
// // import { withRouter } from "react-router-dom";
// import { connect } from "react-redux";

// import "./cesta.scss";

// import store from "../../redux/store";
// import { rdx_productDetail } from "../../redux/actions/products";
// import { minMax, numToStr } from "../../utils/uti";



// class Cesta extends React.Component {
	
// 	constructor (props) {
// 		super(props);
		
// 		this.state = {
// 			total: 0,
			
// 		}
// 	};
	
// 	pulsaComprar() {
// 		//Comprobamos si está logeado el usuario, en caso contrario redirijimos a Login
//         if (!this.props.isLoggedIn) {
// 			//Redireccionando.. 
// 			return setTimeout( () => {
// 				this.props.history.push("/login");
// 			}, 1000);
//         }else{
// 			//Al estar logeado, redireccionamos al a fase final de compra
// 			this.props.history.push("/buy");
// 		}
//     }
	
	
// 	pulsaResultado(productData) {
		
// 		// Guardo en redux
// 		rdx_productDetail(productData);
		
		
// 		// Redirijo
// 		this.props.history.push(`/detail?id=${productData._id}`);
		
// 	};
	
	
	
// 	pulsaBotonMasMenos(_id, cantidad) {
		
// 		// Busco si ya existe en el carrito
// 		const encontrado = this.props.cart.find(_x => _x._id === _id);
		
		
// 		// No se ha encontrado, salgo
// 		if (! encontrado) {
// 			console.log( "ERROR CESTA: no existe el producto que se está editando" );
// 			return;
// 		};
		
		
// 		let nuevaCantidad = minMax( encontrado.cartQuantity + cantidad, 0, 100 ); // sumo o resto cantidad
		
		
// 		// Estoy aplicando cantidad 0, llamo a borrar
// 		if (nuevaCantidad === 0) {
			
// 			store.dispatch({
// 				type: 'CART_REMOVE',
// 				payload: encontrado._id
// 			});
			
			
// 			// Actualizo
// 			this.calculaPrecioTotal();
			
			
// 			return;
			
// 		};
		
		
// 		// Envío a redux
// 		store.dispatch({
// 			type: 'CART_EDIT',
// 			payload: {
// 				_id: encontrado._id,
// 				newQuantity: nuevaCantidad
// 			}
// 		});
		
		
// 		// Actualizo
// 		this.calculaPrecioTotal();
		
// 	};
	
	
	
// 	pulsaBotonEliminar(_id) {
		
// 		// Busco si ya existe en el carrito
// 		const encontrado = this.props.cart.find(_x => _x._id === _id);
		
		
// 		// Si lo encuentro, lo borro
// 		if (encontrado) {
			
// 			store.dispatch({
// 				type: 'CART_REMOVE',
// 				payload: encontrado._id
// 			});
			
// 			// Actualizo
// 			this.calculaPrecioTotal();
			
// 		};
		
// 	};
	
	
	
// 	muestraResultados() {
		
// 		return (
// 			<Fragment>
// 				{
// 					this.props.cart.map(_x => {
// 						return (
// 							<div
// 								className="card"
// 								key={_x._id}
// 							>
// 								<div className="cardHeader">
// 									<img
// 										className="cardImage"
// 										src={_x.imageUrl[0]}
// 										alt="producto"
// 										onClick={ () => { this.pulsaResultado(_x)} }
// 									/>
// 								</div>
								
// 								<div className="cardBody">
// 									<h1 className="totalPrice">{ numToStr(_x.price * _x.cartQuantity) } €</h1>
// 									<h3 className="price mb2">{ numToStr(_x.price)} €/u</h3>
// 									<h2 className="title mb2">{_x.title}</h2>
									
// 								</div>
								
// 								<div className="cajaCantidad">
// 									<button className="botonMenos" onClick={() => {this.pulsaBotonMasMenos(_x._id, -1) } } >-</button>
// 									<span className="cantidad">{_x.cartQuantity}</span>
// 									<button className="botonMas" onClick={() => {this.pulsaBotonMasMenos(_x._id, 1) } } >+</button>
// 								</div>
								
// 								<button className="botonEliminar" onClick={() => {this.pulsaBotonEliminar(_x._id) } } >Eliminar</button>
								
// 							</div>
// 						)
						
// 					})
					
// 				}
// 			</Fragment>
// 		)
		
// 	};
	
	
	
// 	calculaPrecioTotal() {
		
// 		// Calculo suma total
// 		let precioTotal = 0;
		
// 		this.props.cart.map( _x => {
// 			return precioTotal += (_x.price * _x.cartQuantity);
// 		});
		
		
// 		// Envío a redux
// 		store.dispatch({
// 			type: 'CART_TOTAL_PRICE',
// 			payload: precioTotal
// 		});
		
		
// 		console.log( "preciototal :", precioTotal );
		
// 	};
	
	
	
// 	componentDidUpdate() {
// 		this.calculaPrecioTotal();
// 	};
	
	
	
// 	componentDidMount() {
// 		this.calculaPrecioTotal();
// 	};
	
	
	
// 	render() {
		
// 		return (
// 			<div className="mainSearch">
				
// 				<div className="total mt3 mr5">
// 					<button className="botonComprar" onClick={() => {this.pulsaComprar()}}>
// 						<h2>PROCEDER CON LA COMPRA</h2>
// 						<h2>Total: { numToStr(this.props.totalPrice) } €</h2>
// 					</button>
// 				</div>
				
// 				<div className="mainResults pt3 pb3">
// 					{this.muestraResultados()}
// 				</div>
				
// 			</div>
			
// 		);
// 	}
// }



// const mapStateToProps = (state) => { // ese state es de redux
// 	return ({
// 		cart: state.cart,
// 		isLoggedIn: state.isLoggedIn,
// 		totalPrice: state.totalPrice
// 	})
// }
// export default connect(mapStateToProps) (Cesta);