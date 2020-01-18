import React from "react";

import axios from "axios";
import { getUrl } from "../../utils/uti";

import "./registerE.scss";

class registerE extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
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

    async pulsaRegistro() {

        //Comprobamos que todos los campos esten rellenados

        let arrRegister = [
            "username",
            "name",
            "surname",
            "email",
            "password",
            "password2",
            "secretQ",
            "secretA",
            "phone",
            "fiscal",
            "sector",
            "description"
        ];

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

        //comprobacion nombre del registrante
        if (!/[a-z]/gi.test(this.state.username)) {
            this.muestraError("El nombre del registrante debe ser válido.");
            return;
        }

        //comprobacion nombre de la empresa
        if (!/[a-z]/gi.test(this.state.name)) {
            this.muestraError("El nombre de la empresa debe ser válido.");
            return;
        }

        //comprobacion apellido
        if (!/[a-z]/gi.test(this.state.surname)) {
            this.muestraError("El apellido debe ser válido.");
            return;
        }

        //comprobacion telefono
        if (!/[\d()+-]/g.test(this.state.phone)) {
            this.muestraError("El teléfono debe ser válido");
            return;
        }

        //comprobacion del sector de la empresa
        if (!/^[A-Za-z0-9_]+$/gi.test(this.state.sector)) {
            this.muestraError("El sector de la empresa debe ser válido.");
            return;
        }

        if (this.state.fiscal.length < 8) {
            this.muestraError("La información fiscal debe de tener al menos 8 caracteres.");
            return;
        }

        //comprobacion de la identificación fiscal
        if (!/^[A-Za-z0-9]+$/gi.test(this.state.fiscal)) {
            this.muestraError("El identificador fiscal debe ser válido y tener al menos 8 caracteres.");
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
        return (
            <div className="registerMainE">
                {/* <pre>{JSON.stringify(this.state, null,2)}</pre> */}

                <div className="registerCard">
                    <p className="cabeceraRegistro">Inscribe tu Empresa en uRelated</p>
                    <p className="textoRegistro mt3">Información del registrante por parte de la empresa</p>
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
                    <p className="textoRegistro">Datos de tu empresa</p>
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
                            <input className="inputRegister" type="text" maxLength="10" placeholder="C.I.F sin guiones: B12345678" name="fiscal" value={this.state.fiscal} onChange={this.handleChange}></input>
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
                            rows="7"
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

                    <button className="registerButton" onClick={this.pulsaRegistro}>
                        Registrar
                    </button>
                    <p className={this.state.messageClassName}> {this.state.message} </p>
                </div>
            </div>
        );
    }
}

export default registerE;
