import React from "react";

// import axios from "axios";
// import { getUrl, verify } from "../../utils/uti";
import { verify } from "../../utils/uti";

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
            fiscal: "",
            sector: "",
            description: "",

            message: "",
            errorTime: 0,
            messageClassName: "error"
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
        let ele = document.querySelector(".textAddProduct");
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
            fiscal: "",
            sector: "",
            description: "",

            message: "",
            errorTime: 0,
            messageClassName: "error"
        });
    }

    async registraDatos () {
        console.log(this.state);
        //Procedemos a registrar los datos llamando a la API.

        // Procedemos a registrar el nuevo usuario en la base de datos
        // try {
        //     let objectBilling = {
        //         address: this.state.address.trim(),
        //         country: this.state.country.trim(),
        //         city: this.state.city.trim(),
        //         paypal: this.state.paypal.trim(),
        //         card: {
        //             number: this.state.cNumber,
        //             owner: this.state.cOwner,
        //             expireDate: [this.state.expireM, this.state.expireY]
        //         }
        //     };
        //     let tipoUsuario = parseInt(this.state.userType) + 1;
        //     // Construcción del cuerpo del producto.
        //     let body = {
        //         username: this.state.username.trim(),
        //         email: this.state.email.trim(),
        //         password: this.state.password,
        //         secretQuestion: this.state.secretQ.trim(),
        //         secretAnswer: this.state.secretA.trim(),
        //         phone: this.state.phone.trim(),
        //         userType: tipoUsuario,
        //         billing: objectBilling
        //     };
        //     await axios.post(getUrl(`/user/register`), body);
        //     // Muestro
        //     this.muestraError("Usuario registrado con éxito.", 2, false);
        //     setTimeout(() => {
        //         //reseteamos los valores de los input
        //         this.resetState();
        //         //redireccionamos a login
        //         this.props.history.push("/login");
        //     }, 1500);
        // } catch (err) {
        //     if (err.response) {
        //         if (err.response.data) {
        //             this.muestraError("Ha ocurrido un error durante el registro.");
        //         }
        //         return;
        //     }
        //     console.log(err);
        // }
    }

    nextStep(next, actual, isBack) {
        if (isBack === 1) {
            this.setState({ step: actual });
            return;
        }

        if (next === 3) {
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

                //nombre del registrante
                if (!(verificado = verify(this.state.username, 1, "string"))) {
                    console.log("ERROR nombre");
                    break;
                }

                //apellido del registrante
                if (!(verificado = verify(this.state.surname, 1, "string"))) {
                    console.log("ERROR apellido");
                    break;
                }

                break;

            case 2:
                //nombre de la empresa
                if (!(verificado = verify(this.state.name, 1, "string"))) {
                    console.log("ERROR nombre");
                    break;
                }

                //telefono
                if (!(verificado = verify(this.state.phone, 1, "phone"))) {
                    console.log("ERROR teléfono");
                    break;
                }

                //sector de la empresa
                if (!(verificado = verify(this.state.sector, 1, "string"))) {
                    this.muestraError("El sector de la empresa debe ser válido.");
                    break;
                }

                //información fiscal de la empresa
                if (!(verificado = verify(this.state.fiscal, 1, "length", 8))) {
                    this.muestraError("La información fiscal debe de tener al menos 8 caracteres.");
                    break;
                }

                if (!(verificado = verify(this.state.fiscal, 1, "numLetras"))) {
                    this.muestraError("El identificador fiscal debe ser válido y tener al menos 8 caracteres.");
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
                                <p className="cabeceraInput">Nombre</p>
                                <input className="inputRegister" type="text" maxLength="240" placeholder="" name="username" value={this.state.username} onChange={this.handleChange}></input>
                            </div>
                            <div>
                                <p className="cabeceraInput">Primer Apellido</p>
                                <input className="inputRegister" type="text" maxLength="240" placeholder="" name="surname" value={this.state.surname} onChange={this.handleChange}></input>
                            </div>
                            <div>
                                <p className="cabeceraInput">E-mail</p>
                                <input className="inputRegister" type="text" maxLength="240" placeholder="" name="email" value={this.state.email} onChange={this.handleChange}></input>
                            </div>
                        </div>
                        {/* <p className="textoRegistro">Datos de tu empresa</p> */}

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
                                <input className="inputRegister" type="text" maxLength="240" placeholder="" name="name" value={this.state.name} onChange={this.handleChange}></input>
                            </div>
                            <div>
                                <p className="cabeceraInput">Teléfono</p>
                                <input className="inputRegister" type="text" maxLength="100" placeholder="" name="phone" value={this.state.phone} onChange={this.handleChange}></input>
                            </div>
                            <div>
                                <p className="cabeceraInput">Identificación fiscal (C.I.F o N.I.F)</p>
                                <input
                                    className="inputRegister"
                                    type="text"
                                    maxLength="10"
                                    placeholder="C.I.F sin guiones: B12345678"
                                    name="fiscal"
                                    value={this.state.fiscal}
                                    onChange={this.handleChange}
                                ></input>
                            </div>
                            <div>
                                <p className="cabeceraInput">Sector empresarial</p>
                                <input className="inputRegister" type="text" maxLength="240" placeholder="" name="sector" value={this.state.sector} onChange={this.handleChange}></input>
                            </div>
                        </div>

                        <div className="descripcionEmpresa">
                            <p className="cabeceraInput">Descripcion tu empresa</p>
                            <textarea
                                className="textAddProduct"
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
