import React from "react";
// import axios from "axios";
// import bcrypt from "bcryptjs";
// import store from "../../redux/store";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
// import queryString from 'query-string';
// import { getUrl } from "../../utils/uti";
import { verify } from "../../utils/uti";
// import { rdx_productDetail } from "../../redux/actions/products";

import "./passwordRecovery.scss";

class PasswordRecovery extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
			step: "1",
			email: "",

            secretQuestion: "alibaba",
            userAnswer: "",

            password: "",
            password2: "",

            message: "",
            errorTime: 0,
            messageClassName: "error"
        };
    }

    handleChange(event, key) {
        this.setState({
            [key]: event.target.value
        });
    }

    // muestraError2 = muestraError.bind(this);
    muestraError(message, timeout = 3, isError = true) {
        // Pongo la clase
        let className = isError ? "error" : "success";
        this.setState({ messageClassName: className });

        // Pongo el mensaje
        this.setState({ message: message });

        // Ya estoy en loop
        if (this.state.errorTime > 0) {
            this.setState({ errorTime: timeout });
            return; // y salgo
        }

        this.setState({ errorTime: timeout }); // Entro por primera vez, pongo tiempo

        // Loop
        let loop = setInterval(() => {
            if (this.state.errorTime <= 0) {
                this.setState({ message: "" });
                clearInterval(loop); // salgo del loop
            }

            this.setState(preState => ({ errorTime: preState.errorTime - 1 }));
        }, 1000);
    }

    pulsaContinuar1() {

		let verificado = true;

        if (this.state.email === "") {
            this.muestraError("Username / email no puede estar vacio.", 2);
            return;
		}
		
		if (!(verificado = verify(this.state.email, 1, "email"))) {
			console.log("ERROR email");
			return;
		}

		//comprobamos si se trata de un candidato o de una empresa.
		if(verificado === true) {
			
			console.log("ESOOOOOOO SE TRATA DE -> ", this.props.lostPass);

			this.setState({step: "2"});
			return;
		}
		

        // axios.post(
        // 	getUrl("/user/forgotPassword1"),
        // 	{
        // 		"username": this.state.username
        // 	}
        // ).then( (res) => {

        // 	let data = res.data;

        // 	this.setState({
        // 		secretQuestion: data.secretQuestion
        // 	});

        // }).catch( (error) => {

        // 	let errData = error.response.data;

        // 	if (errData.errorCode === "user_recovery_1") {
        // 		this.muestraError("No se ha encontrado ningún usuario.", 2);
        // 		return;
        // 	};

        // });
    }

    async pulsaContinuar2() {

		let verificado = true;


        // Validación
        if (this.state.password === "" || this.state.password2 === "") {
            this.muestraError("Debes escribir la contraseña.", 2);
            return;
        }

        if (this.state.password.length < 4) {
            
            return;
		}
		
		if (!(verificado = verify(this.state.password, 1, "length",4))) {
			this.muestraError("El password debe de tener al menos 4 caracteres.");
			return;
		}

        if (this.state.password !== this.state.password2) {
            this.muestraError("Las contraseñas deben ser iguales.", 2);
            return;
        }

        if (this.state.userAnswer.length < 4) {
            this.muestraError("La respuesta secreta debe tener al menos 4 caracteres.");
            return;
		}
		
		if(verificado === true) {
			
			console.log("no vamos tan tan mal");

		}

        //comprobamos si se trata de un candidato o de una empresa.

        // // Empiezo
        // try {

        // 	// Encripto pass
        // 	const encryptedPass = await bcrypt.hash(this.state.password, 10);

        // 	// Llamo
        // 	await axios.post(
        // 		getUrl("/user/forgotPassword2"),
        // 		{
        // 			"username": this.state.username,
        // 			"userAnswer": this.state.userAnswer,
        // 			"newPassword": encryptedPass
        // 		}
        // 	);

        // 	// Mensaje
        // 	this.muestraError("Tu contraseña ha sido cambiada. Redireccionando al login...", 2000, false);

        // 	// Redirección
        // 	setTimeout( () => {
        // 		this.props.history.push("/login");
        // 	}, 2000);

        // } catch (error) {

        // 	if (error.response) {

        // 		let errData = error.response.data;

        // 		if (errData.errorCode === "user_recovery_2") {
        // 			this.muestraError("La respuesta secreta no era correcta.", 2);
        // 			return;
        // 		};

        // 	};

        // 	this.muestraError(error.response.data);

        // };
	}
	
	

    render() {
        if (this.state.step === "1") {
            return (
                <div className="main mainPasswordRecovery">
                    <div className="card">
                        <div className="cardRecover">
                            <div className="cardHeader">
                                <h1 className="cardTitle"> Recupera tu password. </h1>
                            </div>
                            <div className="stepStatus1 mt5">
                                <div className="zona1"></div>
                                <div className="zona2 ml3"></div>
                            </div>
                            <div className="cardBody mt5">
								<p className="recoverText">Introduce tu e-mail</p>
                                <input
                                    type="text"
                                    placeholder=""
                                    onChange={ev => {
                                        this.handleChange(ev, "email");
                                    }}
                                />
                                <button className="botonRecover mt3"
                                    onClick={() => {
                                        this.pulsaContinuar1();
                                    }}
                                >
                                    Continuar
                                </button>

                                <p className={this.state.messageClassName}> {this.state.message} </p>
                            </div>
                        </div>
                    </div>
                </div>
            );
		} 
		if (this.state.step === "2") {
            return (
                <div className="main mainPasswordRecovery">
                    <div className="card">
                        <div className="cardRecover">
                            <div className="cardHeader">
                                <h1 className="cardTitle"> Recuperación de password. </h1>
                            </div>
                            <div className="stepStatus2 mt5">
                                <div className="zona3"></div>
                                <div className="zona4 ml3"></div>
                            </div>
                            <div className="cardBody mt4">
							<p className="recoverText2 mr3">Pregunta secreta</p>
                                <input type="text" placeholder="" value={this.state.secretQuestion} disabled />
								<p className="recoverText3">Respuesta</p>
                                <input
                                    type="text"
                                    placeholder=""
                                    onChange={ev => {
                                        this.handleChange(ev, "userAnswer");
                                    }}
                                />
								<p className="recoverText2">Nuevo password</p>
                                <input
                                    type="text"
                                    placeholder=""
                                    onChange={ev => {
                                        this.handleChange(ev, "password");
                                    }}
                                />
								<p className="recoverText ml5">Repite nuevo password</p>
                                <input
                                    type="text"
                                    placeholder=""
                                    onChange={ev => {
                                        this.handleChange(ev, "password2");
                                    }}
                                />

                                <button className="botonRecover"
                                    onClick={() => {
                                        this.pulsaContinuar2();
                                    }}
                                >
                                    Cambiar password
                                </button>

                                <p className={this.state.messageClassName}> {this.state.message} </p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

const mapStateToProps = state => {
    // ese state es de redux
    return {
        lostPass: state.lostPass
    };
};

export default connect(mapStateToProps)(withRouter(PasswordRecovery));
