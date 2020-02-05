import React from "react";
import axios from "axios";
import { getUrl, verify } from "../../utils/uti";

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
            phone: "",
            country: "",
            city: "",
            provincia: "",
            picture: "",
            
            errores: [],

            email_err: "",
            password_err: "",
            phone_err: ""
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
            phone: "",
            country: "",
            city: "",
            provincia: "",
            picture: "",
            
            errores: []
        });
    }

    async registraDatos() {
        try {
            //llamada a la DB para registrar la empresa
            let lBody = {
                name: this.state.username,
                surname: this.state.surname,
                email: this.state.email,
                phone: this.state.phone,
                password: this.state.password,
                secretQ: this.state.secretQ,
                secretA: this.state.secretA,
                ciudad: this.state.city,
                provincia: this.state.provincia,
                pais: this.state.country,
                picture: this.state.picture,
            };

            await axios.post(getUrl(`/registerU`), lBody);
            //let data = res.data;

            //redirigimos
            setTimeout(() => {
                this.props.history.push("/loginC");
            }, 500);
        } catch (err) {
            console.log(err);
        }
    }

    nextStep(next, actual, isBack) {
        if (isBack === 1) {
            this.setState({ step: actual });
            return;
        }

        if (next === 4) {
            //último paso del registro, en este caso llamamos a la función que llama a la API
            this.registraDatos();
        } else {
            this.setState({ step: next });
        }

        return;
    }

    pulsaRegistro(actual) {
        let verificado = true;
        let errors = [];

        switch (actual) {
            case 1:
                if (!(verificado = verify(this.state.email, 1, "email"))) {
                    errors.push("email");
                    this.setState({ email_err: "Introduce un email válido." });
                } else {
                    this.setState({ email_err: "" });
                }

                //password
                if (this.state.password === this.state.password2) {
                    this.setState({ password_err: "" });
                    if (!(verificado = verify(this.state.password, 1, "password"))) {
                        errors.push("password");
                        this.setState({ password_err: "Password de mínimo 4 caracteres." });
                    } else {
                        this.setState({ password_err: "" });
                    }
                } else {
                    errors.push("password");
                    verificado = false;
                    this.setState({ password_err: "Los dos passwords deben coincidir." });
                }

                //pregunta y respuesta secreta
                if (this.state.secretQ === "") {
                    verificado = false;
                    errors.push("secretQ");
                }

                if (this.state.secretA === "") {
                    verificado = false;
                    errors.push("secretA");
                }

                break;

            case 2:
                //nombre
                if (!(verificado = verify(this.state.username, 1, "string"))) {
                    errors.push("username");
                }

                //apellido
                if (!(verificado = verify(this.state.surname, 1, "string"))) {
                    errors.push("surname");
                }

                //telefono
                if (!(verificado = verify(this.state.phone, 1, "phone"))) {
                    errors.push("phone");
                    this.setState({ phone_err: "Introduce un teléfono válido." });
                } else {
                    this.setState({ phone_err: "" });
                }

                //picture
                if (!(verificado = verify(this.state.picture, 1, "string"))) {
                    errors.push("picture");
                }

                break;

            case 3:
                //ciudad
                if (!(verificado = verify(this.state.city, 1, "string"))) {
                    errors.push("city");
                }

                //provincia
                if (!(verificado = verify(this.state.provincia, 1, "string"))) {
                    errors.push("provincia");
                }

                //ciudad
                if (!(verificado = verify(this.state.country, 1, "string"))) {
                    errors.push("country");
                }

                break;

            default:
                return;
        }

        if (errors.length) {
            verificado = false;
            this.setState({ errores: errors });
            return;
        }

        if (verificado) {
            //no han habido errores en la introducción de datos, cambiamos al siguiente estado.
            this.setState({ errores: "" });
            let siguiente = actual + 1;
            this.nextStep(siguiente, actual, 0);
        }

        return;
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
                                <input
                                    className={this.errorCheck("password")}
                                    type="password"
                                    maxLength="240"
                                    placeholder=""
                                    name="password"
                                    value={this.state.password}
                                    onChange={this.handleChange}
                                ></input>
                                <p className="errorInputText">{this.state.password_err}</p>
                            </div>
                            <div>
                                <p className="cabeceraInput">Repite password</p>
                                <input
                                    className={this.errorCheck("password")}
                                    type="password"
                                    maxLength="240"
                                    placeholder=""
                                    name="password2"
                                    value={this.state.password2}
                                    onChange={this.handleChange}
                                ></input>
                            </div>
                            <div>
                                <p className="cabeceraInput">Pregunta secreta</p>
                                <input className={this.errorCheck("secretQ")} type="text" maxLength="240" placeholder="" name="secretQ" value={this.state.secretQ} onChange={this.handleChange}></input>
                            </div>
                            <div>
                                <p className="cabeceraInput">Respuesta secreta</p>
                                <input className={this.errorCheck("secretA")} type="text" maxLength="240" placeholder="" name="secretA" value={this.state.secretA} onChange={this.handleChange}></input>
                            </div>
                            <div>
                                <p className="cabeceraInput">E-mail</p>
                                <input className={this.errorCheck("email")} type="text" maxLength="240" placeholder="" name="email" value={this.state.email} onChange={this.handleChange}></input>
                                <p className="errorInputText">{this.state.email_err}</p>
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
                                <input
                                    className={this.errorCheck("username")}
                                    type="text"
                                    maxLength="240"
                                    placeholder=""
                                    name="username"
                                    value={this.state.username}
                                    onChange={this.handleChange}
                                ></input>
                            </div>
                            <div>
                                <p className="cabeceraInput">Primer Apellido</p>
                                <input className={this.errorCheck("surname")} type="text" maxLength="240" placeholder="" name="surname" value={this.state.surname} onChange={this.handleChange}></input>
                            </div>
                            
                            <div>
                                <p className="cabeceraInput">Tfno. móvil</p>
                                <input className={this.errorCheck("phone")} type="text" maxLength="50" placeholder="" name="phone" value={this.state.phone} onChange={this.handleChange}></input>
                                <p className="errorInputText">{this.state.phone_err}</p>
                            </div>
                            <div>
                                <p className="cabeceraInput">Imagen de Perfil</p>
                                <input className={this.errorCheck("picture")} type="text" maxLength="240" placeholder="" name="picture" value={this.state.picture} onChange={this.handleChange}></input>
                                <p className="errorInputText">{this.state.picture_err}</p>
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
                                <input className={this.errorCheck("city")} type="text" maxLength="240" placeholder="" name="city" value={this.state.city} onChange={this.handleChange}></input>
                            </div>
                            <div>
                                <p className="cabeceraInput">Provincia</p>
                                <input
                                    className={this.errorCheck("provincia")}
                                    type="text"
                                    maxLength="240"
                                    placeholder=""
                                    name="provincia"
                                    value={this.state.provincia}
                                    onChange={this.handleChange}
                                ></input>
                            </div>
                            <div>
                                <p className="cabeceraInput">País</p>
                                <input className={this.errorCheck("country")} type="text" maxLength="240" placeholder="" name="country" value={this.state.country} onChange={this.handleChange}></input>
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
