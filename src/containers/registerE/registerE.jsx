import React from "react";
import axios from "axios";
import { getUrl, verify } from "../../utils/uti";

import "./registerE.scss";

class registerE extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            step: 1,
            username: "",
            name: "",
            surname: "",
            email: "",
            password: "",
            password2: "",
            secretQ: "",
            secretA: "",
            phone: "",
            sector: "",
            description: "",

            errores: [],

            email_err: "",
            password_err: "",
            phone_err: ""
        };

        this.pulsaRegistro = this.pulsaRegistro.bind(this);
    }

    handleChange = ev => {
        this.setState({ [ev.target.name]: ev.target.type === "number" ? +ev.target.value : ev.target.value });

        // Excepción para medir caracteres restantes en la descripción
        if (ev.target.name === "description") {
            this.updateDescriptionRemainingCharacters();
        }
    };

    handleChangeCheck = ev => {
        this.setState({ [ev.target.name]: ev.target.type === "number" ? +ev.target.checked : ev.target.checked });
    };

    updateDescriptionRemainingCharacters() {
        let ele = document.querySelector(".textAddInfo");

        if (!document.querySelector(".textAddInfo")) {
            ele = document.querySelector(".textAddInfo2");
        }

        let lenght = ele.value.length;
        let max = ele.maxLength;
        let remaining = document.querySelector("#descriptionRemainingCharacters");

        remaining.innerHTML = `${lenght}/${max}`;

        if (lenght >= max) {
            remaining.classList.add("error");
        } else {
            remaining.classList.remove("error");
        }
    }

    resetState() {
        this.setState({
            step: 1,
            username: "",
            name: "",
            surname: "",
            email: "",
            password: "",
            password2: "",
            secretQ: "",
            secretA: "",
            phone: "",
            // fiscal: "",
            sector: "",
            description: "",

            errores: [],

            email_err: "",
            password_err: "",
            phone_err: ""
        });
    }

    async registraDatos() {

        try {
            //llamada a la DB para registrar la empresa
            let lBody = {
                username: this.state.username,
                surname: this.state.surname,
                name: this.state.name,
                email: this.state.email,
                password: this.state.password,
                secretQ: this.state.secretQ,
                secretA: this.state.secretA,
                phone: this.state.phone,
                sector: this.state.sector,
                description: this.state.description
            };

            //let res = await axios.post(getUrl(`/registerE`), lBody);
            await axios.post(getUrl(`/registerE`), lBody);
            //let data = res.data;

            //redirigimos
            setTimeout(() => {
                this.props.history.push("/loginE");
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

        if (next === 3) {
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

                //nombre del registrante
                if (!(verificado = verify(this.state.username, 1, "string"))) {
                    errors.push("username");
                }

                //apellido del registrante
                if (!(verificado = verify(this.state.surname, 1, "string"))) {
                    errors.push("surname");
                }

                break;

            case 2:
                //nombre de la empresa
                if (!(verificado = verify(this.state.name, 1, "string"))) {
                    errors.push("name");
                }

                //telefono
                if (!(verificado = verify(this.state.phone, 1, "phone"))) {
                    errors.push("phone");
                    this.setState({ phone_err: "Introduce un teléfono válido." });
                } else {
                    this.setState({ phone_err: "" });
                }

                //sector de la empresa
                if (!(verificado = verify(this.state.sector, 1, "string"))) {
                    errors.push("sector");
                }

                if (this.state.description === "") {
                    errors.push("description");
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
                // eslint-disable-next-line
                if (arg == [_y] && arg == "description") {
                    estiloError = "textAddInfo2";
                    return estiloError;
                }

                estiloError = "inputRegister2";
                return estiloError;
            }
        }
        if (arg === "description") {
            estiloError = "textAddInfo";
            return estiloError;
        }
        estiloError = "inputRegister";
        return estiloError;
    }

    render() {
        if (this.state.step === 1) {
            return (
                <div className="registerMainE">
                    <div className="registerCard">
                        <p className="cabeceraRegistro">Inscribe tu Empresa en uRelated</p>
                        <p className="textoRegistro mt3">Información del registrante por parte de la empresa</p>
                        <div className="stepStatus1 mt5">
                            <div className="zona1"></div>
                            <div className="zona2 ml3"></div>
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
                <div className="registerMainE">
                    <div className="registerCard">
                        <p className="cabeceraRegistro">Inscribe tu Empresa en uRelated</p>
                        <p className="textoRegistro">Datos de tu empresa</p>
                        <div className="stepStatus2 mt5">
                            <div className="zona3"></div>
                            <div className="zona4 ml3"></div>
                        </div>
                        <div className="registerCardInfoB">
                            <div>
                                <p className="cabeceraInput">Nombre</p>
                                <input className={this.errorCheck("name")} type="text" maxLength="240" placeholder="" name="name" value={this.state.name} onChange={this.handleChange}></input>
                            </div>
                            <div>
                                <p className="cabeceraInput">Teléfono</p>
                                <input className={this.errorCheck("phone")} type="text" maxLength="100" placeholder="" name="phone" value={this.state.phone} onChange={this.handleChange}></input>
                                <p className="errorInputText">{this.state.phone_err}</p>
                            </div>
                            <div>
                                <p className="cabeceraInput">Sector empresarial</p>
                                <input className={this.errorCheck("sector")} type="text" maxLength="240" placeholder="" name="sector" value={this.state.sector} onChange={this.handleChange}></input>
                            </div>
                        </div>

                        <div className="descripcionEmpresa">
                            <p className="cabeceraInput">Descripcion tu empresa</p>
                            <textarea
                                className={this.errorCheck("description")}
                                rows="5"
                                cols="108"
                                maxLength="2000"
                                placeholder="Utiliza este espacio para describir a tu empresa tal y como quieres que se muestre
                                    a los candidatos. Sugerencia: Puedes utilizar la descripción de tu web corporativa."
                                name="description"
                                value={this.state.description}
                                onChange={this.handleChange}
                            ></textarea>
                            <span id="descriptionRemainingCharacters"></span>
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
                                Registrar
                            </button>
                        </div>
                        <p className={this.state.messageClassName}> {this.state.message} </p>
                    </div>
                </div>
            );
        }
    }
}

export default registerE;
