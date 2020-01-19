import React from "react";

import axios from "axios";
import { getUrl } from "../../utils/uti";

import "./registerC.scss";

class RegisterC extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            step2: 0,
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

        this.pulsaRegistro1 = this.pulsaRegistro1.bind(this);
        this.pulsaRegistro2 = this.pulsaRegistro2.bind(this);
        this.pulsaRegistro3 = this.pulsaRegistro3.bind(this);
    }

    handleChange = ev => {
        this.setState({ [ev.target.name]: ev.target.type === "number" ? +ev.target.value : ev.target.value });
    };

    handleChangeCheck = ev => {
        this.setState({ [ev.target.name]: ev.target.type === "number" ? +ev.target.checked : ev.target.checked });
    };

    resetState() {
        this.setState({
            step2: 0,
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

    pulsaRegistro1() {
        //Comprobamos que todos los campos esten rellenados

        let arrRegister = ["email", "password", "password2", "secretQ", "secretA"];

        for (let _x of arrRegister) {
            if (this.state[_x] === "") {
                this.muestraError("Por favor, debe rellenar todos los campos.");

                return;
            }
        }

        //comprobacion e-mail
        if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(this.state.email)) {
            this.muestraError("Introduce un e-mail válido.");
            return;
        }

        //comprobacion pregunta secreta
        if (this.state.secretQ.length < 4) {
            this.muestraError("La pregunta secreta debe tener al menos 4 caracteres.");
            return;
        }
        if (this.state.secretA.length < 4) {
            this.muestraError("La respuesta secreta debe tener al menos 4 caracteres.");
            return;
        }

        //comprobacion password
        if (this.state.password.length < 4) {
            this.muestraError("El password debe de tener al menos 4 caracteres.");
            return;
        }

        if (this.state.password !== this.state.password2) {
            this.muestraError("Los dos passwords deben coincidir");
            return;
        }

        this.setState({
            step2: 1
        });

        
        
    }

    async pulsaRegistro2() {
        let arrRegister2 = ["username", "surname", "birthday", "phone", "userGenre"];

        for (let _x2 of arrRegister2) {
            if (this.state[_x2] === "") {
                this.muestraError("Por favor, debe rellenar todos los campos.");

                return;
            }
        }

        //comprobacion nombre
        if (!/[a-z]/gi.test(this.state.username)) {
            this.muestraError("El nombre debe de ser válido.");
            return;
        }

        //comprobacion apellido
        if (!/[a-z]/gi.test(this.state.surname)) {
            this.muestraError("El apellido debe de ser válido.");
            return;
        }

        //comprobacion fecha de nacimiento
        if (!/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/gi.test(this.state.birthday)) {
            this.muestraError("Debes proporcionar una fecha válida en YYYY-MM-DD.");
            return;
        }

        //comprobacion telefono
        if (!/[\d()+-]/g.test(this.state.phone)) {
            this.muestraError("El teléfono debe ser válido");
            return;
        }

        
        this.setState({
            step2: 2
        });

        
    }

    async pulsaRegistro3() {

        let arrRegister3 = ["address", "country", "city", "cpostal", "provincia", "pais"];

        for (let _x3 of arrRegister3) {
            if (this.state[_x3] === "") {
                this.muestraError("Por favor, debe rellenar todos los campos.");

                return;
            }
        }

        //comprobacion direccion
        if (!/[a-z]/gi.test(this.state.address)) {
            this.muestraError("La dirección debe ser válida.");
            return;
        }

        //comprobacion ciudad
        if (!/[a-z]/gi.test(this.state.city)) {
            this.muestraError("La ciudad debe ser válida.");
            return;
        }

        //comprobacion código postal
        if (!/[\d()+-]/g.test(this.state.cpostal)) {
            this.muestraError("El código postal debe ser válido");
            return;
        }

        //comprobacion provincia
        if (!/[a-z]/gi.test(this.state.provincia)) {
            this.muestraError("La provincia debe ser válida.");
            return;
        }

        //comprobacion pais
        if (!/[a-z]/gi.test(this.state.country)) {
            this.muestraError("El país debe ser válido.");
            return;
        }

        

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
        if (this.state.step2 === 0) {
            return (
                <div className="registerMainC">
                    {/* <pre>{JSON.stringify(this.state, null,2)}</pre> */}

                    <div className="registerCard">
                        <p className="cabeceraRegistro">Crea tu cuenta</p>
                        <p className="textoRegistro mt3">Información de tu cuenta</p>
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
                        <button className="registerButton" onClick={this.pulsaRegistro1}>
                            Continuar
                        </button>
                        <p className={this.state.messageClassName}> {this.state.message} </p>
                    </div>
                </div>
            );
        }

        if (this.state.step2 === 1) {

            return (
                <div className="registerMainC">
                    {/* <pre>{JSON.stringify(this.state, null,2)}</pre> */}

                    <div className="registerCard">
                        <p className="cabeceraRegistro">Crea tu cuenta</p>
                        <p className="textoRegistro">Datos Personales</p>
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
                        <button className="registerButton" onClick={this.pulsaRegistro2}>
                            Continuar
                        </button>
                        <p className={this.state.messageClassName}> {this.state.message} </p>
                    </div>
                </div>
            );
        } 

        if (this.state.paso2 !== 0 && this.state.paso2 !== 1) {
            
            return (
                <div className="registerMainC">
                    {/* <pre>{JSON.stringify(this.state, null,2)}</pre> */}

                    <div className="registerCard">
                        <p className="cabeceraRegistro">Crea tu cuenta</p>
                        <p className="textoRegistro">Datos Personales</p>
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
                        <button className="registerButton" onClick={this.pulsaRegistro3}>
                            Registrar
                        </button>
                        <p className={this.state.messageClassName}> {this.state.message} </p>
                    </div>
                </div>
            );
        }
    }
}

export default RegisterC;
