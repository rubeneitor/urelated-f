import React from "react";

// import axios from "axios";
// import { getUrl, verify } from "../../utils/uti";
import { verify } from "../../utils/uti";

import "./registerC.scss";

class RegisterC extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            step: 1,
            username: "",
            surname: "",
            email: "",
            password: "",
            password2: "",
            secretQ: "",
            secretA: "",
            birthday: "",
            phone: "",
            userGenre: 0,
            address: "",
            country: "",
            city: "",
            cpostal: "",
            provincia: "",
            check1: false,
            check2: false,
            check3: false,

            message: "",
            errorTime: 0,
            messageClassName: "error"
        };

        this.pulsaRegistro = this.pulsaRegistro.bind(this);
    }

    handleChange = ev => {
        this.setState({ [ev.target.name]: ev.target.type === "number" ? +ev.target.value : ev.target.value });
    };

    handleChangeCheck = ev => {
        this.setState({ [ev.target.name]: ev.target.type === "number" ? +ev.target.checked : ev.target.checked });
    };

    resetState() {
        this.setState({
            step: 1,
            username: "",
            surname: "",
            email: "",
            password: "",
            password2: "",
            secretQ: "",
            secretA: "",
            birthday: "",
            phone: "",
            userGenre: 0,
            address: "",
            country: "",
            city: "",
            cpostal: "",
            provincia: "",
            check1: false,
            check2: false,
            check3: false,

            message: "",
            errorTime: 0,
            messageClassName: "error"
        });
    }

    async registraDatos () {
        console.log(this.state);
        //Procedemos a registrar los datos llamando a la API.
    }

    nextStep(next, actual, isBack) {
        if (isBack === 1) {
            this.setState({ step: actual });
            return;
        }

        if (next === 4) {
            //último paso del registro, en este caso llamamos a la función que llama a la API
            this.registraDatos ();
        } else {
            this.setState({ step: next });
        }

        return;
    }

    pulsaRegistro(actual) {
        let verificado = true;

        switch (actual) {

            
            case 1:
                if (!(verificado = verify(this.state.email, 1, "email"))) {
                    console.log("ERROR email");
                    break;
                }

                //password
                if (this.state.password === this.state.password2) {
                    if (!(verificado = verify(this.state.password, 1, "password"))) {
                        console.log("ERROR password");
                        break;
                    }
                } else {
                    this.muestraError("Los dos passwords deben coincidir");
                    verificado = false;
                    break;
                }

                //pregunta y respuesta secreta
                if (!(verificado = verify(this.state.secretQ, 1, "length", 4))) {
                    console.log("ERROR secretQ");
                    break;
                }

                if (!(verificado = verify(this.state.secretA, 1, "length", 4))) {
                    console.log("ERROR secretA");
                    break;
                }

                break;

            case 2:
                //nombre
                if (!(verificado = verify(this.state.name, 1, "string"))) {
                    console.log("ERROR nombre");
                    break;
                }

                //apellido
                if (!(verificado = verify(this.state.surname, 1, "string"))) {
                    console.log("ERROR apellido");
                    break;
                }

                //fecha de nacimiento
                if (!(verificado = verify(this.state.birthday, 1, "date"))) {
                    console.log("ERROR fecha de nacimiento");
                    break;
                }

                //telefono
                if (!(verificado = verify(this.state.phone, 1, "phone"))) {
                    console.log("ERROR teléfono");
                    break;
                }

                break;

            case 3:
                //direccion
                if (!(verificado = verify(this.state.address, 1, "string"))) {
                    console.log("ERROR direccion");
                    break;
                }

                //ciudad
                if (!(verificado = verify(this.state.city, 1, "string"))) {
                    console.log("ERROR ciudad");
                    break;
                }

                //cpostal
                if (!(verificado = verify(this.state.cpostal, 1, "postalCode"))) {
                    console.log("ERROR cpostal");
                    break;
                }

                //provincia
                if (!(verificado = verify(this.state.provincia, 1, "string"))) {
                    console.log("ERROR provincia");
                    break;
                }

                //ciudad
                if (!(verificado = verify(this.state.pais, 1, "string"))) {
                    console.log("ERROR pais");
                    break;
                }

                break;

            default:
                return;
        }

        if (verificado === true) {
            //no han habido errores en la introducción de datos, cambiamos al siguiente estado.
            let siguiente = actual + 1;
            this.nextStep(siguiente, actual, 0);
        }

        return;
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

    render() {
        if (this.state.step === 1) {
            return (
                <div className="registerMainC">
                    <div className="registerCard">
                        <p className="cabeceraRegistro">Crea tu cuenta</p>
                        <p className="textoRegistro mt3">Información de tu cuenta</p>
                        <div className="stepStatus1 mt5">
                            <div className="zona1"></div>
                            <div className="zona2 ml3"></div>
                            <div className="zona3 ml3"></div>
                        </div>
                        <div className="registerCardInfoA">
                            <div>
                                <p className="cabeceraInput">Password</p>
                                <input className="inputRegister" type="password" maxLength="240" placeholder="" name="password" value={this.state.password} onChange={this.handleChange}></input>
                            </div>
                            <div>
                                <p className="cabeceraInput">Repite password</p>
                                <input className="inputRegister" type="password" maxLength="240" placeholder="" name="password2" value={this.state.password2} onChange={this.handleChange}></input>
                            </div>
                            <div>
                                <p className="cabeceraInput">Pregunta secreta</p>
                                <input className="inputRegister" type="text" maxLength="240" placeholder="" name="secretQ" value={this.state.secretQ} onChange={this.handleChange}></input>
                            </div>
                            <div>
                                <p className="cabeceraInput">Respuesta secreta</p>
                                <input className="inputRegister" type="text" maxLength="240" placeholder="" name="secretA" value={this.state.secretA} onChange={this.handleChange}></input>
                            </div>
                            <div>
                                <p className="cabeceraInput">E-mail</p>
                                <input className="inputRegister" type="text" maxLength="240" placeholder="" name="email" value={this.state.email} onChange={this.handleChange}></input>
                            </div>
                        </div>
                        <button
                            className="registerButton"
                            onClick={() => {
                                this.pulsaRegistro(1);
                            }}
                        >
                            Continuar
                        </button>
                        <p className={this.state.messageClassName}> {this.state.message} </p>
                    </div>
                </div>
            );
        }

        if (this.state.step === 2) {
            return (
                <div className="registerMainC">
                    <div className="registerCard">
                        <p className="cabeceraRegistro">Crea tu cuenta</p>
                        <p className="textoRegistro mt3">Datos Personales</p>
                        <div className="stepStatus2 mt5">
                            <div className="zona1"></div>
                            <div className="zona2 ml3"></div>
                            <div className="zona3 ml3"></div>
                        </div>
                        <div className="registerCardInfoA">
                            <div>
                                <p className="cabeceraInput">Nombre</p>
                                <input className="inputRegister" type="text" maxLength="240" placeholder="" name="username" value={this.state.username} onChange={this.handleChange}></input>
                            </div>
                            <div>
                                <p className="cabeceraInput">Primer Apellido</p>
                                <input className="inputRegister" type="text" maxLength="240" placeholder="" name="surname" value={this.state.surname} onChange={this.handleChange}></input>
                            </div>
                            <div>
                                <p className="cabeceraInput">Género</p>
                                <select className="registerDropdown br" name="userGenre" onChange={this.handleChange}>
                                    <option value="0"></option>
                                    <option value="1">Masculino</option>
                                    <option value="2">Femenino</option>
                                </select>
                            </div>
                            <div>
                                <p className="cabeceraInput">Fecha de nacimiento (YYYY-MM-DD)</p>
                                <input className="inputRegister" type="text" maxLength="11" placeholder="" name="birthday" value={this.state.birthday} onChange={this.handleChange}></input>
                            </div>
                            <div>
                                <p className="cabeceraInput">Dirección</p>
                                <input className="inputRegister" type="text" maxLength="240" placeholder="" name="address" value={this.state.address} onChange={this.handleChange}></input>
                            </div>
                            <div>
                                <p className="cabeceraInput">Tfno. móvil</p>
                                <input className="inputRegister" type="text" maxLength="50" placeholder="" name="phone" value={this.state.phone} onChange={this.handleChange}></input>
                            </div>
                        </div>
                        <div className="botones">
                            <button
                                className="backButton"
                                onClick={() => {
                                    this.nextStep(0, 1, 1);
                                }}
                            >
                                Retroceder
                            </button>
                            <button
                                className="registerButton ml5"
                                onClick={() => {
                                    this.pulsaRegistro(2);
                                }}
                            >
                                Continuar
                            </button>
                        </div>

                        <p className={this.state.messageClassName}> {this.state.message} </p>
                    </div>
                </div>
            );
        }

        if (this.state.step === 3) {
            return (
                <div className="registerMainC">
                    <div className="registerCard">
                        <p className="cabeceraRegistro">Crea tu cuenta</p>
                        <p className="textoRegistro mt3">Datos Personales</p>
                        <div className="stepStatus3 mt5">
                            <div className="zona1"></div>
                            <div className="zona2 ml3"></div>
                            <div className="zona3 ml3"></div>
                        </div>
                        <div className="registerCardInfoB">
                            <div>
                                <p className="cabeceraInput">Ciudad</p>
                                <input className="inputRegister" type="text" maxLength="240" placeholder="" name="city" value={this.state.city} onChange={this.handleChange}></input>
                            </div>
                            <div>
                                <p className="cabeceraInput">Código postal</p>
                                <input className="inputRegister" type="text" maxLength="240" placeholder="" name="cpostal" value={this.state.cpostal} onChange={this.handleChange}></input>
                            </div>
                            <div>
                                <p className="cabeceraInput">Provincia</p>
                                <input className="inputRegister" type="text" maxLength="240" placeholder="" name="provincia" value={this.state.provincia} onChange={this.handleChange}></input>
                            </div>
                            <div>
                                <p className="cabeceraInput">País</p>
                                <input className="inputRegister" type="text" maxLength="240" placeholder="" name="country" value={this.state.country} onChange={this.handleChange}></input>
                            </div>
                            <div className="checkBoxContainer mt5">
                                <label className="container">
                                    ¿Estas trabajando actualmente?
                                    <input type="checkbox" name="check1" value={this.state.check1} onChange={this.handleChangeCheck}></input>
                                    <span className="checkmark"></span>
                                </label>
                            </div>
                            <div className="checkBoxContainer mt5">
                                <label className="container">
                                    ¿Has trabajado con anterioridad?
                                    <input type="checkbox" name="check2" value={this.state.check2} onChange={this.handleChangeCheck}></input>
                                    <span className="checkmark"></span>
                                </label>
                            </div>
                            <div className="checkBoxContainer mt5">
                                <label className="container">
                                    ¿Has cursado estudios oficiales?
                                    <input type="checkbox" name="check3" value={this.state.check3} onChange={this.handleChangeCheck}></input>
                                    <span className="checkmark"></span>
                                </label>
                            </div>
                        </div>
                        <div className="botones">
                            <button
                                className="backButton"
                                onClick={() => {
                                    this.nextStep(0, 2, 1);
                                }}
                            >
                                Retroceder
                            </button>
                            <button
                                className="registerButton ml5"
                                onClick={() => {
                                    this.pulsaRegistro(3);
                                }}
                            >
                                Continuar
                            </button>
                        </div>

                        <p className={this.state.messageClassName}> {this.state.message} </p>
                    </div>
                </div>
            );
        }
    }
}

export default RegisterC;
