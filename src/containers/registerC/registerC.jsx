import React from "react";

import axios from "axios";
import { getUrl } from "../../utils/uti";

import "./registerC.scss";

class RegisterC extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            surname: "",
            email: "",
            password: "",
            password2: "",
            secretQ: "",
            secretA: "",
            birthday: "",
            phone: "",
            userType: 0,
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
            username: "",
            email: "",
            password: "",
            password2: "",
            secretQ: "",
            secretA: "",
            phone: "",
            userType: 1,
            address: "",
            country: "",
            city: "",

            message: "",
            errorTime: 0,
            messageClassName: "error"
        });
    }

    async pulsaRegistro() {

        //pre comprobacion de los checkboxes.
        console.log(this.state.check1);
        console.log(this.state.check2);
        console.log(this.state.check3);
        
        //Comprobamos que todos los campos esten rellenados

        // let arrRegister = ["username", "email", "password", "password2", "secretQ", "secretA", "phone", "userType", "address", "country", "city"];

        // for (let _x of arrRegister) {
        //     if (this.state[_x] === "") {
        //         this.muestraError("Todos los campos son requeridos.");
        //         return;
        //     }
        // }

        // if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(this.state.email)) {
        //     this.muestraError("Introduce un e-mail válido.");
        //     return;
        // }

        // if (this.state.password.length < 4) {
        //     this.muestraError("El password debe de tener al menos 4 caracteres.");
        //     return;
        // }

        // if (!/[\d()+-]/g.test(this.state.phone)) {
        //     this.muestraError("El teléfono debe ser válido");
        //     return;
        // }

        // if (!/[a-z]/gi.test(this.state.address)) {
        //     this.muestraError("La dirección debe ser válida.");
        //     return;
        // }

        // if (!/[a-z]/gi.test(this.state.country)) {
        //     this.muestraError("El país debe ser válido.");
        //     return;
        // }

        // if (!/[a-z]/gi.test(this.state.city)) {
        //     this.muestraError("La ciudad debe ser válida.");
        //     return;
        // }

        // if (this.state.secretQ.length < 4) {
        //     this.muestraError("La pregunta secreta debe tener al menos 4 caracteres.");
        //     return;
        // }
        // if (this.state.secretA.length < 4) {
        //     this.muestraError("La respuesta secreta debe tener al menos 4 caracteres.");
        //     return;
        // }

        // if (this.state.cNumber !== "") {
        //     if (!/[0-9]/g.test(this.state.cNumber)) {
        //         this.muestraError("El numero de la tarjeta debe de ser válido.");
        //         return;
        //     }

        //     if (!/[a-z]/gi.test(this.state.cOwner)) {
        //         this.muestraError("El titular de la tarjeta debe ser válido.");
        //         return;
        //     }

        //     if (!/[0-9]/g.test(this.state.expireM)) {
        //         this.muestraError("El mes de caducidad debe de ser válido.");
        //         return;
        //     }
        //     if (this.state.expireM.length !== 2) {
        //         this.muestraError("El mes de caducidad debe tener 2 caracteres.");
        //         return;
        //     }
        //     if (this.state.expireY.length !== 2) {
        //         this.muestraError("El año de caducidad debe tener 2 caracteres.");
        //         return;
        //     }

        //     if (!/[0-9]/g.test(this.state.expireY)) {
        //         this.muestraError("El año de caducidad debe de ser válido.");
        //         return;
        //     }
        // }

        // if (this.state.password !== this.state.password2) {
        //     this.muestraError("Los dos passwords deben coincidir");
        //     return;
        // }

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
        return (
            <div className="registerMain">
                {/* <pre>{JSON.stringify(this.state, null,2)}</pre> */}

                <div className="registerCard">
                    <p className="cabeceraRegistro">Crea tu cuenta</p>
                    <p className="textoRegistro mt3">Información de tu cuenta</p>
                    <div className="registerCardInfoA">
                        <div>
                            <p className="cabeceraInput">Password</p>
                            <input className="inputRegister" type="password" placeholder="" name="password" value={this.state.password} onChange={this.handleChange}></input>
                        </div>
                        <div>
                            <p className="cabeceraInput">Repite password</p>
                            <input className="inputRegister" type="password" placeholder="" name="password2" value={this.state.password2} onChange={this.handleChange}></input>
                        </div>
                        <div>
                            <p className="cabeceraInput">Pregunta secreta</p>
                            <input className="inputRegister" type="text" placeholder="" name="secretQ" value={this.state.secretQ} onChange={this.handleChange}></input>
                        </div>
                        <div>
                            <p className="cabeceraInput">Respuesta secreta</p>
                            <input className="inputRegister" type="text" placeholder="" name="secretA" value={this.state.secretA} onChange={this.handleChange}></input>
                        </div>
                        <div>
                            <p className="cabeceraInput">E-mail</p>
                            <input className="inputRegister" type="text" placeholder="" name="email" value={this.state.email} onChange={this.handleChange}></input>
                        </div>
                    </div>
                    <p className="textoRegistro">Datos Personales</p>
                    <div className="registerCardInfoB">
                        <div>
                            <p className="cabeceraInput">Nombre</p>
                            <input className="inputRegister" type="text" placeholder="" name="username" value={this.state.username} onChange={this.handleChange}></input>
                        </div>
                        <div>
                            <p className="cabeceraInput">Primer Apellido</p>
                            <input className="inputRegister" type="text" placeholder="" name="surname" value={this.state.surname} onChange={this.handleChange}></input>
                        </div>
                        <div>
                            <p className="cabeceraInput">Género</p>
                            <select className="registerDropdown br" name="userType" onChange={this.handleChange}>
                                <option value="0"></option>
                                <option value="1">Masculino</option>
                                <option value="2">Femenino</option>
                            </select>
                        </div>
                        <div>
                            <p className="cabeceraInput">Fecha de nacimiento</p>
                            <input className="inputRegister" type="text" placeholder="" name="birthday" value={this.state.birthday} onChange={this.handleChange}></input>
                        </div>
                        <div>
                            <p className="cabeceraInput">Dirección</p>
                            <input className="inputRegister" type="text" placeholder="" name="address" value={this.state.address} onChange={this.handleChange}></input>
                        </div>
                        <div>
                            <p className="cabeceraInput">Tfno. móvil</p>
                            <input className="inputRegister" type="text" placeholder="" name="phone" value={this.state.phone} onChange={this.handleChange}></input>
                        </div>
                        <div>
                            <p className="cabeceraInput">Ciudad</p>
                            <input className="inputRegister" type="text" placeholder="" name="city" value={this.state.city} onChange={this.handleChange}></input>
                        </div>
                        <div>
                            <p className="cabeceraInput">Código postal</p>
                            <input className="inputRegister" type="text" placeholder="" name="cpostal" value={this.state.cpostal} onChange={this.handleChange}></input>
                        </div>
                        <div>
                            <p className="cabeceraInput">Provincia</p>
                            <input className="inputRegister" type="text" placeholder="" name="provincia" value={this.state.provincia} onChange={this.handleChange}></input>
                        </div>
                        <div>
                            <p className="cabeceraInput mt3">País</p>
                            <input className="inputRegister" type="text" placeholder="" name="country" value={this.state.country} onChange={this.handleChange}></input>
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
                    <button className="registerButton" onClick={this.pulsaRegistro}>
                        Registrar
                    </button>
                    <p className={this.state.messageClassName}> {this.state.message} </p>
                </div>
            </div>
        );
    }
}

export default RegisterC;
