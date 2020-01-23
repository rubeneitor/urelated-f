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
            step: 1,
            email: "",

            secretQuestion: "alibaba",
            userAnswer: "",

            password: "",
            password2: "",

            errores: []
        };
    }

    handleChange(event, key) {
        this.setState({
            [key]: event.target.value
        });
    }

    async pulsaContinuar1() {
        let verificado = true;
        let errors = [];

        if (!(verificado = verify(this.state.email, 1, "email"))) {
            errors.push("email");
        }

        if (errors.length) {
            verificado = false;
            this.setState({ errores: errors });
            return;
        }

        //comprobamos si se trata de un candidato o de una empresa.
        if (verificado === true) {
            this.setState({ errores: "" });
            console.log("ESOOOOOOO SE TRATA DE -> ", this.props.lostPass);

            //si es un usuario o empresa...buscamos en la base de datos de una forma
            //u otra

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

            this.setState({ step: 2 });
        }
        return;
    }

    async pulsaContinuar2() {
        let verificado = true;
        let errors = [];

        // Validación
        if (this.state.password === this.state.password2) {
            if (!(verificado = verify(this.state.password, 1, "password"))) {
                errors.push("password");
                errors.push("password2");
            }
        } else {
            errors.push("password");
            errors.push("password2");
            verificado = false;
        }

        if (this.state.userAnswer.length < 4) {
            errors.push("userAnswer");
        }

        if (errors.length) {
            verificado = false;
            this.setState({ errores: errors });
            return;
        }

        if (verificado === true) {
            
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

        this.setState({ step: 3 });
        
        // Redirección si es candidato o empresa
        let loginGo = "";
        
        if(this.props.lostPass === "Empresa"){
            loginGo = "loginE";
        }else{
            loginGo = "loginC";
        }
        
        setTimeout( () => {

            this.props.history.push(loginGo);
        
        }, 2250);
            
        }

        
    }

    errorCheck(arg) {
        let estiloError = "inputRegister";

        for (let _y of this.state.errores) {
            // eslint-disable-next-line
            if (arg == [_y]) {
                estiloError = "inputRegister2";
                return estiloError;
            }
        }

        estiloError = "inputRegister";
        return estiloError;
    }

    render() {
        if (this.state.step === 1) {
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
                                    className={this.errorCheck("email")}
                                    type="text"
                                    placeholder=""
                                    onChange={ev => {
                                        this.handleChange(ev, "email");
                                    }}
                                />
                                <button
                                    className="botonRecover mt3"
                                    onClick={() => {
                                        this.pulsaContinuar1();
                                    }}
                                >
                                    Continuar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        if (this.state.step === 2) {
            return (
                <div className="main mainPasswordRecovery">
                    <div className="card2">
                        <div className="cardRecover">
                            <div className="cardHeader">
                                <h1 className="cardTitle"> Recuperación de password. </h1>
                            </div>
                            <div className="stepStatus2 mt5">
                                <div className="zona3"></div>
                                <div className="zona4 ml3"></div>
                            </div>
                            <div className="cardBody mt4">
                                <p className="recoverText2">Pregunta secreta</p>
                                <input 
                                    className={this.errorCheck("secretQuestion")}
                                    type="text" 
                                    placeholder="" 
                                    value={this.state.secretQuestion} disabled />
                                <p className="recoverText4 ml1">Respuesta secreta (*min 4 char.)</p>
                                <input
                                    className={this.errorCheck("userAnswer")}
                                    type="text"
                                    placeholder=""
                                    onChange={ev => {
                                        this.handleChange(ev, "userAnswer");
                                    }}
                                />
                                <p className="recoverText2">Nuevo password</p>
                                <input
                                    className={this.errorCheck("password")}
                                    type="text"
                                    placeholder=""
                                    onChange={ev => {
                                        this.handleChange(ev, "password");
                                    }}
                                />
                                <p className="recoverText3">Repite nuevo password</p>
                                <input
                                    className={this.errorCheck("password2")}
                                    type="text"
                                    placeholder=""
                                    onChange={ev => {
                                        this.handleChange(ev, "password2");
                                    }}
                                />

                                <button
                                    className="botonRecover mt3"
                                    onClick={() => {
                                        this.pulsaContinuar2();
                                    }}
                                >
                                    Cambiar password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        if (this.state.step === 3) {
            return (
                <div className="main mainPasswordRecovery">
                    <div className="card">
                        <div className="cardRecover">
                            <div className="cardHeader">
                                <h1 className="cardTitle"> Password recuperado con éxito. </h1>
                            </div>
                            
                            <div className="cardBody mt5">
                                <p>Redireccionando a Login.</p>
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
