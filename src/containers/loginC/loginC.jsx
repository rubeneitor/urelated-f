import React from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { session, getUrl, verify} from "../../utils/uti";
import store from "../../redux/store";
import { connect } from "react-redux";
import "./loginC.scss";
import { login } from "../../redux/actions/users";

class LoginC extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",

            errores : [],
        };
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

        if(errors.length) {
            verificado = false;
            this.setState({errores: errors});
            return;
        }

        if(verificado){
            this.setState({errores: ''});

            //comprobamos si ya existe un token de sesion y el usuario ya está logeado
            //if((session.get().candi_Id === data[0].id) && session.get().candi_Token){
            if(session.get()?.token){
                console.log("ya estabas logeado...");
                login(true);

                setTimeout(() => {
                    this.props.history.push("/");
                }, 1500);
            }else{
                
                //no está logeado previamente
                try {

                    //llamada para comprobar datos y actualizar token
                    let res = await axios.get(getUrl(`/loginU/${this.state.email}/${this.state.password}`));
                    let data = res.data;
                    
                    if(data[0]){
                        //email y password correctos, token actualizado, guardamos en session

                        session.set({
                            visitor: data[0].name,
                            visitor_id: data[0].id,
                            token: data[0].token,
                            userType: "Candidato",
                        });

                        //variable login de rdx a true
                        login(true);

                        //redirigimos
                        setTimeout(() => {
                            this.props.history.push("/");
                        }, 1000);

                    }else{
                        console.log("nombre y password incorrectos");
                        return;
                    }                
                    
                } catch (err) {
                    console.log("equivocacion....");
                }
            }

        }

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
            <div className="loginMainC">
                <div className="loginCardC">
                    <div className="headerC">
                        <img className="image" src="img/logouRelated_5lit.png" alt="logo2" />
                        <h1>Acceso Candidatos</h1>
                    </div>
                    <p className="textInputLogin mt3">Email</p>
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

                        <p className="linkPassCandidato mt1" onClick={() => this.passwordCandidato()}>Recuperar password.</p>

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

