
import React from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";

import { session, getUrl } from "../../utils/uti";

import './loginC.scss';
import { login } from "../../redux/actions/users";



class LoginC extends React.Component {
	
	constructor (props) {
		super(props);
		 
		this.state = {
			username: "",
			password: "",
			
			message: "",
			errorTime: 0,
			messageClassName: "error",
		};
		
		// this.handleChange = this.handleChange.bind(this); // esto es para que el this de la función clásica pille el de la instancia de la clase Login y no otra
		
	};
	
	
	handleChange(event, key) {
		
		this.setState({
			[key]: event.target.value
		});
		
	};
	
	pulsaRegistro() {

		//Redirección a registro de Empresas
		this.props.history.push("/registerC");

	}
	
	async pulsaLogin() {
		
		// Validación
		let username = this.state.username;
		let password = this.state.password;
		
		
		if (username === "") {
			this.muestraError("El usuario / email no puede estar vacío.");
			return;
		};
		if (password === "") {
			this.muestraError("La contraseña no puede estar vacía.");
			return;
		};
		
		
		
		try {
			
			// Llamada
			let body = {
				username: username,
				password: password
			};
			
			let res = await axios.post( getUrl("/user/login"), body);
			
			let data = res.data;
			
			
			// Guardo datos de sesión
			session.set({
				username: data.username,
				userId: data.userId,
				token: data.token,
				userType: data.userType
			});
			
			
			// Muestro
			// this.muestraError("Accediendo...", 2, false);
			
			
			// Digo que estoy logeado
			login(true);
			
			
			// Redirección
			this.props.history.push("/");
			
			
		} catch (err) {
			
			let res = err.response.data;
			
			
			if (res.errorCode === "user_login_1") {
				this.muestraError("Usuario no encontrado o contraseña incorrecta.");
				return;
			};
			
			if (res.errorCode === "user_login_2") {
				
				// Guardo datos de sesión
				session.set({
					username: res.username,
					userId: res.userId,
					token: res.token,
					userType: res.userType
				});
				
				
				// Muestro mensaje
				this.muestraError("Ya estabas logeado.", 2);
				
				
				// Digo que estoy logeado
				login(true);
				
				
				// Redirijo
				setTimeout( () => {
					this.props.history.push("/");
				}, 2000)
				
				return;
				
			};
			
		};
		
		
	};
	
	
	
	muestraError (message, timeout = 3, isError = true) {
		
		// Pongo la clase
		let className = isError ? "error" : "success";
		this.setState({messageClassName: className});
		
		
		// Pongo el mensaje
		this.setState({message: message});
		
		
		// Ya estoy en loop
		if (this.state.errorTime > 0) {
			this.setState({errorTime: timeout});
			return; // y salgo
		};
		
		
		this.setState({errorTime: timeout}); // Entro por primera vez, pongo tiempo
		
		
		// Loop
		let loop = setInterval( ()=> {
			
			if (this.state.errorTime <= 0) {
				this.setState({message: ""});
				clearInterval(loop); // salgo del loop
			};
			
			
			this.setState( preState => ( {errorTime: preState.errorTime - 1}) );
			
		}, 1000);
		
	};
	
	
	
	render() {
		return(
			<div className="loginMainC">
				<div className="loginCardC">
					<div className="headerC">
						<img className="image"
							src="img/logouRelated_1lit.png"
							alt="logo"
						/>
						<h1>Acceso Candidatos</h1>
					</div>
					<div className="body">
						
						<input
							type="text"
							placeholder="Usuario / email"
							onChange={ (ev) => {this.handleChange(ev, "username")} }
						></input>
						
						<input
							type="password"
							placeholder="Contraseña"
							onChange={ (ev) => {this.handleChange(ev, "password")} }
						></input>
						
						<button onClick={ () => this.pulsaLogin() }>Entrar</button>
						
						<NavLink to="/passwordRecovery">
							<p>¿Has olvidado la contraseña?</p>
						</NavLink>
						
						<p className={this.state.messageClassName}> {this.state.message} </p>
						
					</div>
				</div>
				<div className="loginCardC ml3">
					<button onClick={ () => this.pulsaRegistro() }>Regístrate candidato</button>
				</div>
			</div>
		);
	};
	
	
};



export default LoginC;