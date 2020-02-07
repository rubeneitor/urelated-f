import React, { Fragment } from "react";
import axios from "axios";
// import { withRouter } from "react-router-dom";
import Moment from 'react-moment';
import 'moment-timezone';
import queryString from "query-string";
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
            loading: true,
            
            foto: "",

            errores: [],

            errorMuestra: "",
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
            // let token = session.get()?.token;
            let id = queries.id;

            const res = await axios.get(getUrl(`/perfilU/${queries.id}`));
            
            this.setState({ 

                userData: res.data[id],
                username: res.data[id].name,
                surname: res.data[id].surname,
                phone: res.data[id].phone,
                email: res.data[id].email,
                country: res.data[id].pais,
                provincia: res.data[id].provincia,
                ciudad: res.data[id].ciudad,
                foto: res.data[id].picture ? res.data[id].picture : "img/placeProfile.png",
                loading: false,

            });

            
        } catch (err) {
            console.error(err);
        }

        
    }

    showButton() {
        let visitor_id = session.get()?.visitor_id;
        let visitor_name = session.get()?.visitor;
        let userType = session.get()?.userType;
        const queries = queryString.parse(this.props.location.search);
        // eslint-disable-next-line
        if ((visitor_id == queries.id && visitor_name == queries.name) && userType == "Candidato") {
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
        }
    }

    async clickEditar() {
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
                try {
                    //llamada a la DB para registrar la empresa
                    let id = session.get()?.visitor_id;
                    let token = session.get()?.token;
                    let userType = session.get()?.userType;

                    let lBody = {
                        token: token,
                        userType: userType,
                        id: id,
                        name: this.state.username,
                        surname: this.state.surname,
                        phone: this.state.phone,
                        email: this.state.email,
                        ciudad: this.state.ciudad,
                        provincia: this.state.provincia,
                        country: this.state.country
                    };

                    let res = await axios.post(getUrl(`/perfilUMod`), lBody);

                    if(res.data.error){
                        this.setState({errorMuestra: res.data.error})
                        return;
                    }
                    

                    this.props.history.push(`/`);
                } catch (err) {
                    console.log(err);
                }
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
        // eslint-disable-next-line
        if(this.state.loading == true){
            return (
                
                    <div>
                        <div className="main">
                            <div className="mainProfileC">
                                <img className="spinnerImg" src="img/spinner.gif" alt="spinnerCargaE"/>
                            </div>
                        </div>
                    </div>
                
            );
        }

        return (
            <div className="main">
                <div className="mainProfileC">
                    <div className="cardProfileC">
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
                                        name="email"
                                        value={this.state.email}
                                        onChange={this.handleChange}
                                    ></input>
                                    <p className="error_little ml3"> {this.state.errorMuestra} </p>
                                </div>
                                <div className="mt5">
                                    <p className="cabeceraInput">Teléfono</p>
                                    <input
                                        className={`${this.errorCheck("phone")}`}
                                        readOnly={this.state.readOnly}
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
                                        name="country"
                                        value={this.state.country}
                                        onChange={this.handleChange}
                                    ></input>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="profileRightSide">
                        <div className="cardEditProfile ml5">
                            <div className="cardEditProfileHeader">
                                <img src={this.state.foto} alt="imagenperfilCandidato"/>
                            </div>
                            <div className="cardEditProfileBody mt3">
                                <div className="editInfoRight">
                                    <p className="nameMod mt3">{this.state.name}</p>
                                    <p className="dateMod mt3"><Moment format="DD/MM/YYYY">{this.state.userData?.updated_at}</Moment></p>
                                    <p className="dateMod2">Última fecha de modificación.</p>
                                    {this.showButton()}
                                </div>
                            </div>
                        </div>
                        <div className="cardCV ml5">
                        <button
                        className="blueButton"
                        onClick={() => {
                            this.props.history.push(`/curriculum?id=${this.state.userData?.id}&name=${this.state.userData?.name}`);
                        }}
                    >
                        Currículum
                    </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ProfileC;
