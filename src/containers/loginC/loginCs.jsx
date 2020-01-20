import React from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { session, getUrl } from "../../utils/uti";
import store from "../../redux/store";
import { connect } from "react-redux";
import "./loginC.scss";
import { login } from "../../redux/actions/users";
import { rdx_productDetail } from "../../redux/actions/products";

class LoginC extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",

            message: "",
            errorTime: 0,
            messageClassName: "error"
        };

        // this.handleChange = this.handleChange.bind(this); // esto es para que el this de la función clásica pille el de la instancia de la clase Login y no otra
    }

    handleChange(event, key) {
        this.setState({
            [key]: event.target.value
        });
    }

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
        }
        if (password === "") {
            this.muestraError("La contraseña no puede estar vacía.");
            return;
        }

        // try {
        //     // Llamada
        //     let body = {
        //         username: username,
        //         password: password
        //     };

        //     let res = await axios.post(getUrl("/user/login"), body);

        //     let data = res.data;

        //     // Guardo datos de sesión
        //     session.set({
        //         username: data.username,
        //         userId: data.userId,
        //         token: data.token,
        //         userType: data.userType
        //     });

        //     // Muestro
        //     // this.muestraError("Accediendo...", 2, false);

        //     // Digo que estoy logeado
        //     login(true);

        //     // Redirección
        //     this.props.history.push("/");
        // } catch (err) {
        //     let res = err.response.data;

        //     if (res.errorCode === "user_login_1") {
        //         this.muestraError("Usuario no encontrado o contraseña incorrecta.");
        //         return;
        //     }

        //     if (res.errorCode === "user_login_2") {
        //         // Guardo datos de sesión
        //         session.set({
        //             username: res.username,
        //             userId: res.userId,
        //             token: res.token,
        //             userType: res.userType
        //         });

        //         // Muestro mensaje
        //         this.muestraError("Ya estabas logeado.", 2);

        //         // Digo que estoy logeado
        //         login(true);

        //         // Redirijo
        //         setTimeout(() => {
        //             this.props.history.push("/");
        //         }, 2000);

        //         return;
        //     }
        // }
    }

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

    passwordCandidato () {

        //redux para indicar que se trata de un candidato
        store.dispatch({
            type: 'PASSWORD',
            payload: "Candidato"
        });


        //Redirección a registro de Empresas
        this.props.history.push("/passwordRecovery");
    }

    render() {
        return (
            <div className="loginMainC">
                <div className="loginCardC">
                    <div className="headerC">
                        {/* <p className="logoText">uRelated</p> */}
                        <img className="image" src="img/logouRelated_5lit.png" alt="logo2" />
                        <h1>Acceso Candidatos</h1>
                    </div>
                    <div className="body mt3">
                        <input
                            type="text"
                            placeholder="Usuario / email"
                            onChange={ev => {
                                this.handleChange(ev, "username");
                            }}
                        ></input>

                        <input
                            className="mt1"
                            type="password"
                            placeholder="Contraseña"
                            onChange={ev => {
                                this.handleChange(ev, "password");
                            }}
                        ></input>

                        <button className="mt1" onClick={() => this.pulsaLogin()}>
                            Entrar
                        </button>

                        <p className="linkPassCandidato" onClick={() => this.passwordCandidato()}>¿Has olvidado la contraseña?</p>

                        <p className={this.state.messageClassName}> {this.state.message} </p>
                    </div>
                </div>
                <div className="vertical-line"></div>
                <div className="loginCardC2">
                    <div className="userRegInfoCont">
                        <div className="infoText">
                            <div className="userRegIcon">
                                <img className="ml3 imageI" src="img/sheet.png" alt="sheetI" />
                            </div>
                            <p className="ml1">Añade tus skills, experiencia y mantén tus competencias al dia.</p>
                        </div>
                        <div className="infoText">
                            <div className="userRegIcon">
                                <img className="ml3 imageI" src="img/check.png" alt="checkI" />
                            </div>
                            <p className="ml1 mr5">Inscribete de forma sencilla y segura en las ofertas que susciten tu interés.</p>
                        </div>
                        <div className="infoText">
                            <div className="userRegIcon">
                                <img className="ml3 imageI" src="img/loudspeaker.png" alt="loudI" />
                            </div>
                            <p className="ml1 mr3">Comparte opiniones y accede a contenido relevante en tu sector.</p>
                        </div>
                        <button className="botonRegistroUsuarios mt3" onClick={() => this.pulsaRegistro()}>
                            Regístrate
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => { // ese state es de redux
	return ({
		lostPass: state.lostPass
	})
}


export default connect(mapStateToProps) (withRouter(LoginC));

