import React from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { session, getUrl, verify } from "../../utils/uti";
import store from "../../redux/store";
import { connect } from "react-redux";
import "./loginE.scss";
import { login } from "../../redux/actions/users";


class LoginE extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",

            errores: [],

            errorMuestra: "",
        };

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
            
            //comprobamos si ya existe un token de sesion y el usuario ya está logeado
            if(session.get()?.token){
                
                login(true);

                setTimeout(() => {
                    this.props.history.push("/");
                }, 1500);
            }else{
                
                //no está logeado previamente

                try {
                    
                    //llamada para comprobar datos y actualizar token
                    
                    let lBody = {
                        email: this.state.email,
                        password: this.state.password
                    }

                    let res = await axios.post(getUrl(`/loginE`),lBody);
                    let data = res.data;

                    // eslint-disable-next-line
                    if(data.error){
                        this.setState({errorMuestra: data.error})
                        return;
                    }
                    
                    if(data[0]){
                        
                        //email y password correctos, token actualizado, guardamos en session
                        session.set({
                            visitor: data[0].name,
                            visitor_id: data[0].id,
                            token: data[0].token,
                            userType: "Empresa",
                        });
                        
                        //variable login de rdx a true
                        login(true);

                        //redirigimos a home
                        setTimeout(() => {
                            this.props.history.push("/");
                        }, 200);
                    }

                }catch (err){
                    console.log(err);
                }
            }
        }
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
            // eslint-disable-next-line
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
                        <p className="error"> {this.state.errorMuestra} </p>
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

