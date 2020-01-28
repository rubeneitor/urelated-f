import React, { Fragment } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import queryString from 'query-string';
import { session, getUrl, verify } from "../../utils/uti";
import "./profileC.scss";

class ProfileC extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userData: "",
            button: "blueButton",

            readOnly: true,

            username: "",
            surname: "",
            phone: "",
            email: "",
            country: "",
            provincia: "",
            ciudad: "",

            errores: []
        };

        this.clickEditar = this.clickEditar.bind(this);
    }

    resetStates() {
        this.setState({
            userData: "",
            button: "blueButton",

            readOnly: true,

            username: "",
            surname: "",
            phone: "",
            email: "",
            country: "",
            provincia: "",
            ciudad: "",

            errores: []
        });
    }

    handleChange = ev => {
        this.setState({ [ev.target.name]: ev.target.type === "number" ? +ev.target.value : ev.target.value });
    };

    async componentDidMount() {
        
        this.resetStates();

        const queries = queryString.parse(this.props.location.search);

        try {
            let token = session.get()?.token;
            // let id = session.get()?.visitor_id;

            const res = await axios.get(getUrl(`/perfilU/${queries.id}`));

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
        
        if((visitor_id == queries.id) && (visitor_name == queries.name)){
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

            //nombre de usuario
            if (!(verificado = verify(this.state.username, 1, "string"))) {
                errors.push("username");
            }

            //apellido de usuario
            if (!(verificado = verify(this.state.surname, 1, "string"))) {
                errors.push("surname");
            }

            //ciudad del  usuario
            if (!(verificado = verify(this.state.ciudad, 1, "string"))) {
                errors.push("ciudad");
            }

            //provincia del usuario
            if (!(verificado = verify(this.state.provincia, 1, "string"))) {
                errors.push("provincia");
            }

            //pais del usuario
            if (!(verificado = verify(this.state.country, 1, "string"))) {
                errors.push("country");
            }

            //telefono
            if (!(verificado = verify(this.state.phone, 1, "phone"))) {
                errors.push("phone");
                this.setState({ phone_err: "Introduce un teléfono válido." });
            } else {
                this.setState({ phone_err: "" });
            }

            if (errors.length) {
                verificado = false;
                this.setState({ errores: errors });
                return;
            }

            if (verificado) {
                //no hay errores,...llamamos a la base de datos y actualizamos los datos
                console.log("LA MADRE QUE NOS PARIO...CANDIDATO....todo bien! preparado para registrar!");
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
                estiloError = "inputProfile3";
                return estiloError;
            }
        }

        return estiloError;
    }

    render() {
        return (
            <div className="main">
                <div className="mainProfileE">
                    <div className="cardProfile">
                        <div className="cardHeader">
                            <p className="profileText">Datos personales.</p>
                        </div>
                        <div className="line"></div>
                        <div className="profileInfo">
                            <div className="profileInfoGrid">
                                <div className="mt5">
                                    <p className="cabeceraInput ml3">Nombre</p>
                                    <input
                                        className={`${this.errorCheck("username")} ml3`}
                                        readOnly={this.state.readOnly}
                                        placeholder={this.state.userData?.name}
                                        name="username"
                                        value={this.state.username}
                                        onChange={this.handleChange}
                                    ></input>
                                </div>
                                <div className="mt5">
                                    <p className="cabeceraInput">Apellido</p>
                                    <input
                                        className={`${this.errorCheck("surname")}`}
                                        readOnly={this.state.readOnly}
                                        placeholder={this.state.userData?.surname}
                                        name="surname"
                                        value={this.state.surname}
                                        onChange={this.handleChange}
                                    ></input>
                                </div>
                                <div className="mt5">
                                    <p className="cabeceraInput ml3">E-mail</p>
                                    <input
                                        className={`${this.errorCheck("email")} ml3`}
                                        readOnly={this.state.readOnly}
                                        placeholder={this.state.userData?.email}
                                        name="email"
                                        value={this.state.email}
                                        onChange={this.handleChange}
                                    ></input>
                                </div>
                                <div className="mt5">
                                    <p className="cabeceraInput">Teléfono</p>
                                    <input
                                        className={`${this.errorCheck("phone")}`}
                                        readOnly={this.state.readOnly}
                                        placeholder={this.state.userData?.phone}
                                        name="phone"
                                        value={this.state.phone}
                                        onChange={this.handleChange}
                                    ></input>
                                </div>
                                <div className="mt5">
                                    <p className="cabeceraInput ml3">Ciudad</p>
                                    <input
                                        className={`${this.errorCheck("ciudad")} ml3`}
                                        readOnly={this.state.readOnly}
                                        placeholder={this.state.userData?.ciudad}
                                        name="ciudad"
                                        value={this.state.ciudad}
                                        onChange={this.handleChange}
                                    ></input>
                                </div>
                                <div className="mt5">
                                    <p className="cabeceraInput">Provincia</p>
                                    <input
                                        className={`${this.errorCheck("provincia")}`}
                                        readOnly={this.state.readOnly}
                                        placeholder={this.state.userData?.provincia}
                                        name="provincia"
                                        value={this.state.provincia}
                                        onChange={this.handleChange}
                                    ></input>
                                </div>
                                <div className="mt5">
                                    <p className="cabeceraInput ml3">País</p>
                                    <input
                                        className={`${this.errorCheck("country")} ml3`}
                                        readOnly={this.state.readOnly}
                                        placeholder={this.state.userData?.pais}
                                        name="country"
                                        value={this.state.country}
                                        onChange={this.handleChange}
                                    ></input>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="cardEditProfile ml5">
                        <div className="cardEditProfileHeader">
                            <img src="https://www.rd.com/wp-content/uploads/2017/09/01-shutterstock_476340928-Irina-Bg-1024x683.jpg" alt="logoEmpresa" />
                        </div>
                        <div className="cardEditProfileBody mt3">
                            <div className="editInfoRight">
                                {/* <p>{this.state.userData?.name}</p>
                                <p className="mt1">{this.state.userData?.updated_at}</p> */}
                                <p className="nameMod mt3">{this.state.userData?.name}</p>
                                <p className="dateMod mt3">28/01/2020</p>
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

export default ProfileC;
