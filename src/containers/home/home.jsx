import React, { Component } from 'react';
import { listaCategorias } from '../../utils/uti';
import './home.scss';

class Home extends Component {

	constructor(props) {
		super(props);
		
		this.state = {
			detail: {},
			categoriaSugerida : ""
		}
		
	}

	UNSAFE_componentWillMount () {
		//Comprobamos si hay una categoría guardada en el localStorage.

		if(localStorage.getItem("categoriaBuscada")) {
			this.setState({ categoriaSugerida : localStorage.getItem("categoriaBuscada") });
		}else{

			//En caso de no haberla, asignamos una categoría random.

			let arrCategorias = Object.keys(listaCategorias);
		
			let lengthObj = Object.keys(listaCategorias).length;
		
			let numRand = Math.floor (Math.random() * ((lengthObj + 1) - 0) + 0);
	
			this.setState({ categoriaSugerida: arrCategorias[numRand] });
		}
	}

	
	render() {
		return (
			<p>este es el home si</p>
		// <div className="home">
		// 	<div className="mainHome">
					
		// 			<div className="sliderProductosHome">por rellenar</div>
					
					
					
					
		// 			<div className="sliderProductosHome">por rellenar</div>
					
					
					
		// 			<div className="sliderProductosHome">por rellenar</div>
					
					
					
					
		// 			<div className="sliderProductosHome">por rellenar</div>
					
					
					
		// 	</div>
		// </div>
		)
	}

}

export default Home;