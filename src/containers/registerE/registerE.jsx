
import React from "react";

import axios from "axios";
import { getUrl } from "../../utils/uti";

import './registerE.scss';


class RegisterE extends React.Component {
	
    constructor (props) {
		super(props);
		
		this.state = {
            username: "",
            email: "",
            password: "",
            password2: "",
            secretQ: "",
            secretA: "",
            phone: "",
            userType: 0,
            address: "",
            country: "",
            city: "",
            paypal: "",
            cNumber: "",
            cOwner: "",
            expireM: "",
            expireY: "",

            message: "",
			errorTime: 0,
			messageClassName: "error",
		};
		
        this.pulsaRegistro = this.pulsaRegistro.bind(this);
    };
    
    handleChange = (ev) =>{
         
        this.setState({[ev.target.name]: ev.target.type === 'number' ? +ev.target.value : ev.target.value});
        
    }

    resetState () {

        this.setState(
        {
            username: "",
            email: "",
            password: "",
            password2: "",
            secretQ: "",
            secretA: "",
            phone: "",
            userType: 1,
            address: "",
            country: "",
            city: "",
            paypal: "",
            cNumber: "",
            cOwner: "",
            expireM: "",
            expireY: "",

            message: "",
			errorTime: 0,
			messageClassName: "error",
		});

    }

   
    async pulsaRegistro ()  {

        //Comprobamos que todos los campos esten rellenados

        let arrRegister = ["username","email","password","password2","secretQ","secretA",
        "phone","userType","address","country","city"];

        for (let _x of arrRegister) {
            if (this.state[_x] === "") {
                this.muestraError("Todos los campos son requeridos.");
                return;
            };
        };

		
		
        if (this.state.paypal === "" && this.state.cNumber === "") {
            this.muestraError(`Debes de introducir una dirección paypal o una tarjeta de crédito válida.`);
            return;
        };


        if (! /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(this.state.email) ) {
            this.muestraError("Introduce un e-mail válido.");
            return;
        };

        if (this.state.paypal !== "") {
            if (! /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(this.state.paypal) ) {
                this.muestraError("Introduce un paypal válido.");
                return;
            };
        }
        
        if (this.state.password.length < 4) {
            this.muestraError("El password debe de tener al menos 4 caracteres.");
            return;
        };

        if (! /[\d()+-]/g.test(this.state.phone) ) {
            this.muestraError("El teléfono debe ser válido");
            return;
        };

        if (! /[a-z]/gi.test(this.state.address) ) {
            this.muestraError("La dirección debe ser válida.");
            return;
        };

        if (! /[a-z]/gi.test(this.state.country) ) {
            this.muestraError("El país debe ser válido.");
            return;
        };

        if (! /[a-z]/gi.test(this.state.city) ) {
            this.muestraError("La ciudad debe ser válida.");
            return;
        };

		if (this.state.secretQ.length < 4) {
            this.muestraError("La pregunta secreta debe tener al menos 4 caracteres.");
            return;
		};
		if (this.state.secretA.length < 4) {
            this.muestraError("La respuesta secreta debe tener al menos 4 caracteres.");
            return;
		};

        if (this.state.cNumber !== "") {
            if (! /[0-9]/g.test(this.state.cNumber) ) {
                this.muestraError("El numero de la tarjeta debe de ser válido.");
                return;
            };

            if (! /[a-z]/gi.test(this.state.cOwner) ) {
                this.muestraError("El titular de la tarjeta debe ser válido.");
                return;
            };
        
            if (! /[0-9]/g.test(this.state.expireM) ) {
                this.muestraError("El mes de caducidad debe de ser válido.");
                return;
            };
            if (this.state.expireM.length !== 2) {
                this.muestraError("El mes de caducidad debe tener 2 caracteres.");
                return;
            }
            if (this.state.expireY.length !== 2) {
                this.muestraError("El año de caducidad debe tener 2 caracteres.");
                return;
            }
        
            if (! /[0-9]/g.test(this.state.expireY) ) {
                this.muestraError("El año de caducidad debe de ser válido.");
                return;
            };
        }
		
		
		
        if (this.state.password !== this.state.password2) {
            this.muestraError("Los dos passwords deben coincidir");
            return;
		}
		
		
		
        // Procedemos a registrar el nuevo usuario en la base de datos
        try {
			
            let objectBilling = {
                "address": this.state.address.trim(),
                "country": this.state.country.trim(),
                "city": this.state.city.trim(),
                "paypal": this.state.paypal.trim(),
                "card": {
                    "number": this.state.cNumber,
                    "owner": this.state.cOwner,
                    "expireDate": [this.state.expireM, this.state.expireY]
                }
            };

            let tipoUsuario = parseInt(this.state.userType) + 1;
           
			// Construcción del cuerpo del producto.
			let body = {
                username: this.state.username.trim(),
                email: this.state.email.trim(),
                password: this.state.password,
                secretQuestion: this.state.secretQ.trim(),
                secretAnswer: this.state.secretA.trim(),
                phone: this.state.phone.trim(),
                userType: tipoUsuario,
                billing: objectBilling
            };

            await axios.post( getUrl(`/user/register`), body);
			
			// Muestro
            this.muestraError("Usuario registrado con éxito.", 2, false);
            
            setTimeout ( () => {
                //reseteamos los valores de los input
                this.resetState();
                //redireccionamos a login
                this.props.history.push("/login");
            },1500)
            
			
		} catch (err) {
			
			if(err.response) {
                if(err.response.data) {
                    this.muestraError("Ha ocurrido un error durante el registro.");
                }
                return;
            }
            console.log(err);
		};
    }

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
			<div className="registerMain">
            {/* <pre>{JSON.stringify(this.state, null,2)}</pre> */}

				<div className="registerCard">
					<h2>AQUI SE REGISTRAN LAS MALDITAS EMPRESAS</h2>
					<div className="registerCardInfoA">
                        <input className="inputRegister" type="text" placeholder="Nombre de usuario" name="username" value={this.state.username}  onChange={this.handleChange} ></input>
                        <input className="inputRegister" type="text" placeholder="E-mail"  name="email" value={this.state.email}  onChange={this.handleChange} ></input>
                        <input className="inputRegister" type="password" placeholder="Password"  name="password" value={this.state.password}  onChange={this.handleChange} ></input>
                        <input className="inputRegister" type="password" placeholder="Repite password"  name="password2" value={this.state.password2}  onChange={this.handleChange} ></input>
                        <input className="inputRegister" type="text" placeholder="Pregunta secreta"  name="secretQ" value={this.state.secretQ}  onChange={this.handleChange} ></input>
                        <input className="inputRegister" type="text" placeholder="Respuesta secreta"  name="secretA" value={this.state.secretA}  onChange={this.handleChange} ></input>
                    </div>
                    <h2>Personal</h2>
                    <div className="registerCardInfoB">
                        <input className="inputRegister" type="text" placeholder="Dirección" name="address" value={this.state.address}  onChange={this.handleChange} ></input>
                        <input className="inputRegister" type="text" placeholder="Teléfono" name="phone" value={this.state.phone}  onChange={this.handleChange} ></input>
                        <input className="inputRegister" type="text" placeholder="Ciudad" name="city" value={this.state.city}  onChange={this.handleChange} ></input>
                        <input className="inputRegister" type="text" placeholder="País" name="country" value={this.state.country}  onChange={this.handleChange} ></input>
                        <select className="registerDropdown br" name="userType" onChange={this.handleChange}>
						    	<option value="0">Soy comprador</option>
						    	<option value="1">Soy vendedor</option>
						</select>
					</div>
                    <h2>Facturación</h2>
                    <div className="registerCardInfoB">
                        <input className="inputRegister" type="text" placeholder="Número de tarjeta" name="cNumber" value={this.state.cNumber}  onChange={this.handleChange} ></input>
                        <input className="inputRegister" type="text" placeholder="Nombre de propietario" name="cOwner" value={this.state.cOwner}  onChange={this.handleChange} ></input>
                        <input className="inputRegister" type="text" placeholder="Mes caducidad" name="expireM" value={this.state.expireM}  onChange={this.handleChange} ></input>
                        <input className="inputRegister" type="text" placeholder="Año caducidad" name="expireY" value={this.state.expireY}  onChange={this.handleChange} ></input>
                        <input className="inputRegister" type="text" placeholder="Paypal" name="paypal" value={this.state.paypal}  onChange={this.handleChange} ></input>
                    </div>
                    <h2>Facturación</h2>
                    <div className="registerCardInfoB">
                        <input className="inputRegister" type="text" placeholder="Número de tarjeta" name="cNumber" value={this.state.cNumber}  onChange={this.handleChange} ></input>
                        <input className="inputRegister" type="text" placeholder="Nombre de propietario" name="cOwner" value={this.state.cOwner}  onChange={this.handleChange} ></input>
                        <input className="inputRegister" type="text" placeholder="Mes caducidad" name="expireM" value={this.state.expireM}  onChange={this.handleChange} ></input>
                        <input className="inputRegister" type="text" placeholder="Año caducidad" name="expireY" value={this.state.expireY}  onChange={this.handleChange} ></input>
                        <input className="inputRegister" type="text" placeholder="Paypal" name="paypal" value={this.state.paypal}  onChange={this.handleChange} ></input>
                    </div>
                    <h2>Facturación</h2>
                    <div className="registerCardInfoB">
                        <input className="inputRegister" type="text" placeholder="Número de tarjeta" name="cNumber" value={this.state.cNumber}  onChange={this.handleChange} ></input>
                        <input className="inputRegister" type="text" placeholder="Nombre de propietario" name="cOwner" value={this.state.cOwner}  onChange={this.handleChange} ></input>
                        <input className="inputRegister" type="text" placeholder="Mes caducidad" name="expireM" value={this.state.expireM}  onChange={this.handleChange} ></input>
                        <input className="inputRegister" type="text" placeholder="Año caducidad" name="expireY" value={this.state.expireY}  onChange={this.handleChange} ></input>
                        <input className="inputRegister" type="text" placeholder="Paypal" name="paypal" value={this.state.paypal}  onChange={this.handleChange} ></input>
                    </div>
                    <h2>Facturación</h2>
                    <div className="registerCardInfoB">
                        <input className="inputRegister" type="text" placeholder="Número de tarjeta" name="cNumber" value={this.state.cNumber}  onChange={this.handleChange} ></input>
                        <input className="inputRegister" type="text" placeholder="Nombre de propietario" name="cOwner" value={this.state.cOwner}  onChange={this.handleChange} ></input>
                        <input className="inputRegister" type="text" placeholder="Mes caducidad" name="expireM" value={this.state.expireM}  onChange={this.handleChange} ></input>
                        <input className="inputRegister" type="text" placeholder="Año caducidad" name="expireY" value={this.state.expireY}  onChange={this.handleChange} ></input>
                        <input className="inputRegister" type="text" placeholder="Paypal" name="paypal" value={this.state.paypal}  onChange={this.handleChange} ></input>
                    </div>
                    <h2>Facturación</h2>
                    <div className="registerCardInfoB">
                        <input className="inputRegister" type="text" placeholder="Número de tarjeta" name="cNumber" value={this.state.cNumber}  onChange={this.handleChange} ></input>
                        <input className="inputRegister" type="text" placeholder="Nombre de propietario" name="cOwner" value={this.state.cOwner}  onChange={this.handleChange} ></input>
                        <input className="inputRegister" type="text" placeholder="Mes caducidad" name="expireM" value={this.state.expireM}  onChange={this.handleChange} ></input>
                        <input className="inputRegister" type="text" placeholder="Año caducidad" name="expireY" value={this.state.expireY}  onChange={this.handleChange} ></input>
                        <input className="inputRegister" type="text" placeholder="Paypal" name="paypal" value={this.state.paypal}  onChange={this.handleChange} ></input>
                    </div>
                    <h2>Facturación</h2>
                    <div className="registerCardInfoB">
                        <input className="inputRegister" type="text" placeholder="Número de tarjeta" name="cNumber" value={this.state.cNumber}  onChange={this.handleChange} ></input>
                        <input className="inputRegister" type="text" placeholder="Nombre de propietario" name="cOwner" value={this.state.cOwner}  onChange={this.handleChange} ></input>
                        <input className="inputRegister" type="text" placeholder="Mes caducidad" name="expireM" value={this.state.expireM}  onChange={this.handleChange} ></input>
                        <input className="inputRegister" type="text" placeholder="Año caducidad" name="expireY" value={this.state.expireY}  onChange={this.handleChange} ></input>
                        <input className="inputRegister" type="text" placeholder="Paypal" name="paypal" value={this.state.paypal}  onChange={this.handleChange} ></input>
                    </div>
					
                    <button onClick={this.pulsaRegistro}>Registrar</button>
                    <p className={this.state.messageClassName}> {this.state.message} </p>
                    
				</div>

			</div>
		);
	};
	
	
};


export default RegisterE;
