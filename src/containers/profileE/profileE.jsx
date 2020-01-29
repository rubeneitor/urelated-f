import React, { Fragment } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import queryString from 'query-string';
import { session, getUrl, verify } from "../../utils/uti";
import "./profileE.scss";

class ProfileE extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userData: [],
            button: "blueButton",
            readOnly: true,

            sector: "",
            phone: "",
            name: "",
            email: "",
            description: "",

            errores: []
        };

        this.clickEditar = this.clickEditar.bind(this);
    }

    resetStates() {
        this.setState({
            userData: "",
            button: "blueButton",

            readOnly: true,

            sector: "",
            phone: "",
            name: "",
            email: "",
            description: "",

            errores: []
        });
    }

    handleChange = ev => {
        this.setState({ [ev.target.name]: ev.target.type === "number" ? +ev.target.value : ev.target.value });

        // Excepción para medir caracteres restantes en la descripción
        if (ev.target.name === "description") {
            this.updateDescriptionRemainingCharacters();
        }
    };

    updateDescriptionRemainingCharacters() {
        let ele = document.querySelector(".textAddInfo2");

        if (!document.querySelector(".textAddInfo2")) {
            ele = document.querySelector(".textAddInfo3");
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

    async componentDidMount() {

        this.resetStates();

        const queries = queryString.parse(this.props.location.search);

        try {
            let token = session.get()?.token;
            // let id = session.get()?.visitor_id;

            const res = await axios.get(getUrl(`/perfilE/${queries.id}`));

            this.setState({ userData: res.data[0] });

        } catch (err) {
            console.error(err);
        }

        console.log(this.state.userData);

    }


    showButton() {

        let visitor_id = session.get()?.visitor_id;
        let visitor_name = session.get()?.visitor;
        const queries = queryString.parse(this.props.location.search);
        
        if((visitor_id === queries.id) && (visitor_name === queries.name)){
            return (
                <Fragment>
                    <button
                        className={this.state.button}
                        onClick={() => {
                            this.clickEditar();
                        }}
                    >
                        Editar
                    </button>
                </Fragment>
            );
        };

        
    }

    clickEditar() {
        //estilo del boton ... aviso (boton rojo) y edicion habilitada
        if (this.state.button === "blueButton") {
            this.setState({ button: "redButton" });
            //inputs y cajas de texto editables
            this.setState({ readOnly: false });
        } else {
            //el boton es de color rojo y se procede a editar
            let verificado = true;
            let errors = [];

            if (!(verificado = verify(this.state.email, 1, "email"))) {
                errors.push("email");
                this.setState({ email_err: "Introduce un email válido." });
            } else {
                this.setState({ email_err: "" });
            }

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

            if (errors.length) {
                verificado = false;
                this.setState({ errores: errors });
                return;
            }

            if (verificado) {
                //no hay errores,...llamamos a la base de datos y actualizamos los datos
                console.log("LA MADRE QUE NOS PARIO");
            }

            return;
        }
    }

    errorCheck(arg) {
        let estiloError = "";

        if (this.state.button === "blueButton") {
            estiloError = "inputProfile";
        } else {
            estiloError = "inputProfile2";
        }

        for (let _y of this.state.errores) {
            // eslint-disable-next-line
            if (arg == [_y]) {
                // eslint-disable-next-line
                if (arg == [_y] && arg == "description") {
                    estiloError = "textAddInfo3";
                    return estiloError;
                }

                estiloError = "inputProfile3";
                return estiloError;
            }
        }
        if (arg === "description") {
            if (this.state.button === "redButton") {
                estiloError = "textAddInfo2";
                return estiloError;
            }
            estiloError = "textAddInfo";
            return estiloError;
        }
        return estiloError;
    }

    render() {
        return (
            <div className="main">
                <div className="mainProfileE">
                    <div className="cardProfile">
                        <div className="cardHeader">
                            <p className="profileText">Datos de la entidad.</p>
                        </div>
                        <div className="line"></div>
                        <div className="profileInfo">
                            <div className="profileInfoGrid">
                                <div className="mt5">
                                    <p className="cabeceraInput ml3">Nombre</p>
                                    <input
                                        className={`${this.errorCheck("name")} ml3`}
                                        readOnly={this.state.readOnly}
                                        placeholder={this.state.userData?.name}
                                        name="name"
                                        value={this.state.name}
                                        onChange={this.handleChange}
                                    ></input>
                                </div>
                                <div className="mt5">
                                    <p className="cabeceraInput">E-mail</p>
                                    <input
                                        className={`${this.errorCheck("email")}`}
                                        readOnly={this.state.readOnly}
                                        placeholder={this.state.userData?.email}
                                        name="email"
                                        value={this.state.email}
                                        onChange={this.handleChange}
                                    ></input>
                                </div>
                                <div className="mt5">
                                    <p className="cabeceraInput ml3">Teléfono</p>
                                    <input
                                        className={`${this.errorCheck("phone")} ml3`}
                                        readOnly={this.state.readOnly}
                                        placeholder={this.state.userData?.phone}
                                        name="phone"
                                        value={this.state.phone}
                                        onChange={this.handleChange}
                                    ></input>
                                </div>
                                <div className="mt5">
                                    <p className="cabeceraInput">Sector</p>
                                    <input
                                        className={`${this.errorCheck("sector")}`}
                                        readOnly={this.state.readOnly}
                                        placeholder={this.state.userData?.sector}
                                        name="sector"
                                        value={this.state.sector}
                                        onChange={this.handleChange}
                                    ></input>
                                </div>
                            </div>
                            <div className="descripcionEmpresa mr5">
                                <p className="cabeceraInput">Descripcion de tu empresa</p>
                                <textarea
                                    // className={this.errorCheck("description")}
                                    className={`${this.errorCheck("description")}`}
                                    readOnly={this.state.readOnly}
                                    rows="7"
                                    cols="50"
                                    maxLength="2000"
                                    placeholder={this.state.userData?.description}
                                    name="description"
                                    value={this.state.description}
                                    onChange={this.handleChange}
                                ></textarea>
                                <span id="descriptionRemainingCharacters"></span>
                            </div>
                        </div>
                    </div>
                    <div className="cardEditProfile ml5">
                        <div className="cardEditProfileHeader">
                            <img src="https://www.bang-olufsen.com/~/media/images/bang-olufsen-attention-logo.png" alt="logoEmpresa" />
                        </div>
                        <div className="cardEditProfileBody mt3">
                            <div className="editInfoRight">
                                {/* <p>{this.state.userData?.name}</p>
                                <p className="mt1">{this.state.userData?.updated_at}</p> */}
                                <p className="nameMod mt3">{this.state.userData?.name}</p>
                                <p className="dateMod mt3">27/01/2020</p>
                                <p className="dateMod2">Última fecha de modificación.</p>
                                {this.showButton()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ProfileE;
