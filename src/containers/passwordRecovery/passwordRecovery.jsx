
import React from "react";
import axios from "axios";
import bcrypt from "bcryptjs";

import { getUrl } from "../../utils/uti";


import "./passwordRecovery.scss";



class PasswordRecovery extends React.Component {
	
	constructor (props) {
		super(props);
		
		
		this.state = {
			
			username: "",
			
			secretQuestion: "",
			userAnswer: "",
			
			password: "",
			password2: "",
			
			message: "",
			errorTime: 0,
			messageClassName: "error",			
			
		}
		
	};
	
	
	
	handleChange(event, key) {
		
		this.setState({
			[key]: event.target.value
		});
		
	};	
	
	
	
	// muestraError2 = muestraError.bind(this);
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
	
	
	
	pulsaContinuar1() {
		
		if (this.state.username === "") {
			this.muestraError("Username / email no puede estar vacio.", 2);
			return;
		};
		
		
		axios.post(
			getUrl("/user/forgotPassword1"), 
			{
				"username": this.state.username
			}
		).then( (res) => {
			
			let data = res.data;
			
			this.setState({
				secretQuestion: data.secretQuestion
			});
			
		}).catch( (error) => {
			
			let errData = error.response.data;
			
			if (errData.errorCode === "user_recovery_1") {
				this.muestraError("No se ha encontrado ningún usuario.", 2);
				return;
			};
			
		});
		
	};
	
	
	
	async pulsaContinuar2() {
		
		// Validación
		if ((this.state.password === "") || (this.state.password2 === "")) {
			this.muestraError("Debes escribir la contraseña.", 2);
			return;
		};
		
        if (this.state.password.length < 4) {
            this.muestraError("El password debe de tener al menos 4 caracteres.");
            return;
        };
		
		if (this.state.password !== this.state.password2) {
			this.muestraError("Las contraseñas deben ser iguales.", 2);
			return;
		};
		
		
		if (this.state.userAnswer.length < 4) {
            this.muestraError("La respuesta secreta debe tener al menos 4 caracteres.");
            return;
		};
		
		
		
		// Empiezo
		try {
			
			// Encripto pass
			const encryptedPass = await bcrypt.hash(this.state.password, 10);
			
			
			// Llamo
			await axios.post(
				getUrl("/user/forgotPassword2"), 
				{
					"username": this.state.username,
					"userAnswer": this.state.userAnswer,
					"newPassword": encryptedPass
				}
			);
			
			
			// Mensaje
			this.muestraError("Tu contraseña ha sido cambiada. Redireccionando al login...", 2000, false);
			
			
			// Redirección
			setTimeout( () => {
				this.props.history.push("/login");
			}, 2000);
			
			
		} catch (error) {
			
			if (error.response) {
				
				let errData = error.response.data;
				
				if (errData.errorCode === "user_recovery_2") {
					this.muestraError("La respuesta secreta no era correcta.", 2);
					return;
				};
				
			};
			
			
			this.muestraError(error.response.data);
			
		};
		
	};
	
	
	
	render() {
		
		if (this.state.secretQuestion === "") {
			
			return (
				<div className="main mainPasswordRecovery">
					<div className="card">
						<div className="cardHeader">
							<h1 className="cardTitle"> Paso 1/2 </h1>
						</div>
						<div className="cardBody mt4">
							<input type="text" placeholder="Usuario / email" onChange={ (ev) => {this.handleChange(ev, "username")} } />
							<button onClick={ () => {this.pulsaContinuar1()} }>Continuar</button>
							
							<p className={this.state.messageClassName}> {this.state.message} </p>
						</div>
					</div>
				</div>
			);			
			
		} else {
			
			return(

				<div className="main mainPasswordRecovery">
					<div className="card">
						<div className="cardHeader">
							<h1 className="cardTitle"> Paso 2/2 </h1>
						</div>
						<div className="cardBody mt4">
							<input type="text" placeholder="Esperando pregunta secreta..." value={this.state.secretQuestion} disabled />
							<input type="text" placeholder="Respuesta" onChange={ (ev) => {this.handleChange(ev, "userAnswer")} } />
							<input type="text" placeholder="Nueva contraseña" onChange={ (ev) => {this.handleChange(ev, "password")} } />
							<input type="text" placeholder="Repite nueva contraseña" onChange={ (ev) => {this.handleChange(ev, "password2")} } />
							
							<button onClick={ () => {this.pulsaContinuar2()} }>Cambiar contraseña</button>
							
							<p className={this.state.messageClassName}> {this.state.message} </p>
						</div>
					</div>
				</div>
				
			)
			
		}

	};
	
	
};


export default PasswordRecovery;