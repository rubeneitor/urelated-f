import React from "react";
// import { NavLink } from "react-router-dom";
// import axios from "axios";
import { withRouter } from "react-router-dom";
import { session, getUrl, verify } from "../../utils/uti";
import store from "../../redux/store";
import { connect } from "react-redux";
import "./loginE.scss";
// import { login } from "../../redux/actions/users";
// import { rdx_productDetail } from "../../redux/actions/products";


class LoginE extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",

            errores: [],
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
        this.props.history.push("/registerE");
    }

    async pulsaLogin() {
        // Validación
        let verificado = true;
        let errors = [];

        if (!(verificado = verify(this.state.email, 1, "email"))) {
            errors.push("email");
        }

        if (!(verificado = verify(this.state.password, 1, "password"))) {
            errors.push("password");
        }

        if(errors.length) {
            verificado = false;
            this.setState({errores: errors});
            
            return;
        }

        if(verificado){
            this.setState({errores: ''});
            // try {
            // Llamada
            // let body = {
            //     username: username,
            //     password: password
            // };

            // let res = await axios.get(getUrl("/suscripciones"));
            // console.log(res);
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
        // }
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
        return;

    }

    passwordEmpresa () {

        //redux para indicar que se trata de una empresa
        store.dispatch({
            type: 'PASSWORD',
            payload: "Empresa"
        });


        //Redirección a registro de Empresas
        this.props.history.push("/passwordRecovery");
    }

    errorCheck(arg){
        let estiloError = "inputRegister";
        
        for(let _y of this.state.errores){
            if(arg == [_y]){
                estiloError = "inputRegister2";
                return estiloError;
            }
        }

        estiloError = "inputRegister";
        return estiloError;
    }

    render() {
        return (
            <div className="loginMainE">
                <div className="loginCardE">
                    <div className="headerE">
                        <img className="image" src="img/logouRelated_5lit.png" alt="logo2" />
                        <h1>Acceso Empresas</h1>
                    </div>
                    <p className="textInputLogin mt3 ml5">Email</p>
                    <div className="body">
                        <input
                            className={this.errorCheck("email")}
                            type="text"
                            placeholder=""
                            onChange={ev => {
                                this.handleChange(ev, "email");
                            }}
                        ></input>
                        <p className="textInputLogin2 mt1">Password</p>
                        <input
                            className={this.errorCheck("password")}
                            type="password"
                            placeholder=""
                            onChange={ev => {
                                this.handleChange(ev, "password");
                            }}
                        ></input>

                        <button className="mt3" onClick={() => this.pulsaLogin()}>
                            Entrar
                        </button>

                        <p className="linkPassEmpresa mt1" onClick={() => this.passwordEmpresa()}>Recuperar password.</p>

                        <p className={this.state.messageClassName}> {this.state.message} </p>
                    </div>
                </div>
                <div className="vertical-line"></div>
                <div className="loginCardE2">
                    <div className="userRegInfoCont">
                        <div className="infoText">
                            <div className="userRegIcon">
                                <img className="ml3 imageI" src="img/pointer.png" alt="pointI" />
                            </div>
                            <p className="ml1 mr5">Publica ofertas de trabajo de forma casi instantánea.</p>
                        </div>
                        <div className="infoText">
                            <div className="userRegIcon">
                                <img className="ml3 imageI" src="img/mail.png" alt="mailI" />
                            </div>
                            <p className="ml1 mr5">Accede a currículums con un solo click. Disponiendo
                            de los datos de contacto de miles de candidatos.</p>
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


export default connect(mapStateToProps) (withRouter(LoginE));

