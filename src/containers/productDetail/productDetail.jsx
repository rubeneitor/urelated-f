
// import React from "react";
// import { connect } from "react-redux";
// import { withRouter } from "react-router-dom";
// import queryString from 'query-string';

// import "./productDetail.scss";

// // import Slider from "../../components/slider/slider";
// import store from "../../redux/store";
// import axios from "axios";
// import { getUrl, numToStr } from "../../utils/uti";
// import { rdx_productDetail } from "../../redux/actions/products";



// class ProductDetail extends React.Component {
	
// 	constructor (props) {
// 		super(props);
		
// 		this.state = {
// 			quantity: 0,
// 			imageIdx: 0,
// 			purchaseData: ["a"],
			
// 		}
// 	};
	
	
	
// 	cambiaDropdown (ev) {
// 		this.setState({ quantity: ev.target.value });
// 	};
	
// 	pulsaFoto (ev, idx) {
// 		this.setState({ imageIdx: idx });
// 	};
	
// 	meteCesta (_id) {
		
// 		// Clono el objeto del producto
// 		let productData = {...this.props.productData};
		
		
// 		// Busco si ya existe en el carrito
// 		const encontrado = this.props.cart ? this.props.cart.find(_x => _x._id === productData._id) : false;
		
// 		if (! encontrado) { // NO existe ese producto
			
// 			productData.cartQuantity = +this.state.quantity; // pongo cantidad
			
			
// 			// Envío a redux
// 			store.dispatch({
// 				type: 'CART_ADD',
// 				payload: productData // OBJ con la info del producto
// 			});	
			
// 		} else { // ya existía
			
// 			let newQuantity = encontrado.cartQuantity + +this.state.quantity; // sumo cantidad
			
			
// 			// Envío a redux
// 			store.dispatch({
// 				type: 'CART_EDIT',
// 				payload: {
// 					_id: productData._id,
// 					newQuantity: newQuantity
// 				}
// 			});
			
// 		};
		
// 	}
	
// 	pulsaComprar (_id) {
		
// 		//Comprobamos si está logeado el usuario, en caso contrario redirijimos a Login
//         if (!this.props.isLoggedIn) {
			
// 			//Redireccionando.. 
// 			return setTimeout( () => {
// 				this.props.history.push("/login");
// 			}, 1000);
			
//         } else {
			
// 			//Introducimos el producto en el carrito..
// 			this.meteCesta(_id);
			
// 			//Al estar logeado, redireccionamos al a fase final de compra
// 			this.props.history.push("/cart");
// 		}
// 	}
	
// 	pulsaKarma (nKarma) {
		
// 		console.log ( `Karma pulsado ${nKarma}` ); 
		
// 	}
	
	
	
// 	async componentDidMount() {
		
// 		// Guardo la última categoría que he mirado
// 		localStorage.setItem("categoriaBuscada", this.props.productData?.category);
		
		
// 		// Busco query
// 		const queries = queryString.parse(this.props.location.search);
		
		
// 		if (! this.props.productData && queries.id) { // no tengo el prop y tengo param
			
// 			try {
				
// 				// Pido info
// 				let res = await axios.get( getUrl(`/product/get?id=${queries.id}`) );
				
// 				// Guardo en redux
// 				rdx_productDetail(res.data[0]);
				
// 			} catch (err) {
// 				console.error( err );
// 			};
			
// 		};
		
		
// 		// Pongo estado por defecto
// 		this.setState({ quantity: 1 }); // pongo la cantidad 1 por defecto
		
		
		
// 		// Pido info de purchase, a ver si tengo el producto en casa
// 		let res2 = await axios.get( getUrl(`/purchase/get?productId=${this.props.productData._id}&status=3`) );
		
// 		// Guardo estado según la info que me llega
// 		this.setState( { purchaseData: res2.data ? (res2.data[res2.data.length - 1]) : [] } );
		
// 	}
	
	
	
// 	render() {
		
// 		return (
			
// 			<div className="productDetailMain">
// 				{
// 					this.props.productData &&
// 					<div className="productDetail">
					
// 						<div className="images">
// 							<div className="bigImage br">
// 								<img className="img" src={this.props.productData.imageUrl[this.state.imageIdx]} alt=""/>
// 							</div>
							
// 							<div className="gallery">
// 								<img className={ this.props.productData.imageUrl[0] ? "miniImg" : "hide" } id="img0" onClick={ (ev) => this.pulsaFoto(ev, 0) } src={this.props.productData.imageUrl[0]} alt="" />
// 								<img className={ this.props.productData.imageUrl[1] ? "miniImg" : "hide" } id="img1" onClick={ (ev) => this.pulsaFoto(ev, 1) } src={this.props.productData.imageUrl[1]} alt="" />
// 								<img className={ this.props.productData.imageUrl[2] ? "miniImg" : "hide" } id="img2" onClick={ (ev) => this.pulsaFoto(ev, 2) } src={this.props.productData.imageUrl[2]} alt="" />
// 								<img className={ this.props.productData.imageUrl[3] ? "miniImg" : "hide" } id="img3" onClick={ (ev) => this.pulsaFoto(ev, 3) } src={this.props.productData.imageUrl[3]} alt="" />
// 							</div>
							
// 						</div>
						
						
						
// 						<div className="detail">
// 							<h2 className="title">{this.props.productData.title}</h2>
// 							<p className="seller">Vendedor: <a href="/">{this.props.productData._ownerUsername}</a> </p>
// 							<p className="sellerRating">
// 							Karma: {this.props.productData._ownerKarma}
// 								{/* <img className="ratingStar" src="/img/star.png" alt=""/>
// 								<img className="ratingStar" src="/img/star.png" alt=""/>
// 								<img className="ratingStar" src="/img/star.png" alt=""/>
// 								<img className="ratingStar" src="/img/star_half.png" alt=""/>
// 								<img className="ratingStar" src="/img/star_disabled.png" alt=""/> */}
// 							</p>
// 							<h1 className="price">{this.props.productData.price} €</h1>
// 							<p className="description">
// 								{this.props.productData.description}
// 							</p>
// 						</div>
						
						
						
// 						<div className="purchase">
// 							<h1 className="price">{ numToStr(this.state.quantity * this.props.productData.price) } €</h1>
							
// 							<p></p>
							
// 							<div
// 								className="cajaDropdown"
// 								onChange={ (ev) => this.cambiaDropdown(ev) }
// 							>
								
// 								<p>Cantidad: </p>
// 								<select>
// 									<option value="1">1</option>
// 									<option value="2">2</option>
// 									<option value="3">3</option>
// 									<option value="4">4</option>
// 									<option value="5">5</option>
// 									<option value="6">6</option>
// 									<option value="7">7</option>
// 									<option value="8">8</option>
// 									<option value="9">9</option>
// 									<option value="10">10</option>
// 								</select>
								
// 							</div>
							
// 							<button className="purchaseButton" onClick={ () => {this.meteCesta(this.props.productData._id)} }>Añadir a la cesta</button>
// 							<button className="purchaseButton" onClick={ () => {this.pulsaComprar(this.props.productData._id)} }>Comprar</button>
							
							
// 							{ this.state.purchaseData &&
// 								<div className="cajaKarma">
// 									<button className="karmaMas" onClick={ () => {this.pulsaKarma(1)} }>+ 1 karma</button>
// 									<button className="karmaMenos" onClick={ () => {this.pulsaKarma(-1)} }>- 1 karma</button>
// 								</div>
// 							}
							
							
// 						</div>
// 					</div>
// 				}
				
// {/* 				
// 				<Slider
// 					url={`/product/category?cat=${this.props.productData?.category}&excludeId=${this.props.productData?._id}&limit=25`}
// 				/> */}
				
// 			</div>
// 		);
// 	};
	
	
	
// };



// const mapStateToProps = (state) => { // ese state es de redux
// 	return ({
// 		productData: state.productData,
// 		isLoggedIn: state.isLoggedIn,
// 		cart: state.cart
// 	})
// }


// export default connect(mapStateToProps) (withRouter(ProductDetail));
