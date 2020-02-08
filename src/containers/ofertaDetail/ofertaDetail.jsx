import React, { Fragment } from "react";
import "./ofertaDetail.scss";
import { session, getUrl, verify } from "../../utils/uti";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import queryString from "query-string";
import axios from "axios";
import moment from "moment";
import "moment-timezone";

class OfertaDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userType: "",
            numSuscritos: "",
            botonCandidato: false,
            detailOferta: "",
            publicada: "",
            readOnly: true,
            button: "blueButton",
            experiencia: "",

            num_vacantes: "",
            description: "",

            errores: [],

            num_vacantes_err: "",
        };

        this.clickEditar = this.clickEditar.bind(this);
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
        let userType = session.get()?.userType;
        let visitor_id = session.get()?.visitor_id;
        //obtenemos el tipo de usuario de session
        this.setState(
            {
                userType: userType,
                visitor_id: visitor_id
            },
            () => {}
        );

        //obtenemos el número de suscritos a la oferta

        try {
            let id_oferta = this.props.ofertaDetail.id;
            let descripcionNull = "";
            let experiencia = "";

            if (!this.props.ofertaDetail?.desc_general) {
                descripcionNull = "Oferta sin descripción general";
            } else {
                descripcionNull = this.props.ofertaDetail?.desc_general;
            }

            // eslint-disable-next-line
            if (this.props.ofertaDetail?.exp_requerida == 1){
                experiencia = "No requerida";
            }else{
                experiencia = this.props.ofertaDetail?.exp_requerida + " año/s";
            }

            // let before = moment(this.props.ofertaDetail?.created_at).format('YYYY-MM-DD HH:mm:ss')
            // let now = moment().format('YYYY-MM-DD HH:mm:ss')
            

            // let publicada = moment(now).diff(before, "days");

            let publicada = this.calculo();

            

            this.setState(
                {
                    num_vacantes: this.props.ofertaDetail?.num_vacantes,
                    description: descripcionNull,
                    publicada: publicada,
                    experiencia: experiencia
                },
                () => {}
            );

            const res = await axios.get(getUrl(`/numSuscritos?id_oferta=${id_oferta}`));
            // eslint-disable-next-line
            if (userType == "Candidato") {
                const res2 = await axios.get(getUrl(`/isCandidato?id_candidato=${this.state.visitor_id}&id_oferta=${id_oferta}`));

                if (!res2.data[0]) {
                    this.setState({ botonCandidato: true }, () => {});
                }
            }

            this.setState({ numSuscritos: res.data }, () => {});
        } catch (err) {
            console.error(err);
        }
    }

    calculo(){
            
            let res = "";
            let before = moment(this.props.ofertaDetail?.created_at).format('YYYY-MM-DD HH:mm:ss')
            let now = moment().format('YYYY-MM-DD HH:mm:ss')
            

            let days = moment(now).diff(before, "days");
            let hours = moment(now).diff(before, "hours");
            let mins = moment(now).diff(before, "mins");

            if (days > 0) {

                if (days === 1){
                    res = days + " día.";
                    return res;
                }
                res = days + " días.";
                return res;
            }

            if (hours < 24) {

                if (hours === 1){
                    res = hours + " hora.";
                    return res;
                }
                res = hours + " horas.";
                return res;
            }

            if (mins < 60) {

                if (mins === 1){
                    res = mins + " minuto.";
                    return res;
                }
                res = mins + " minutos.";
                return res;
            }
    }

    async suscribirse() {
        let id_oferta = this.props.ofertaDetail.id;
        let id_usuario = this.state.visitor_id;
        let date = new Date().toISOString().slice(0, 10);

        let bodySus = {
            id_oferta: id_oferta,
            id_usuario: id_usuario,
            date: date
        };

        try {
            await axios.post(getUrl(`/nuevaSuscripcion`), bodySus);

            //redirigimos
            setTimeout(() => {
                this.props.history.push("/candidaturas");
            }, 1000);
        } catch (error) {
            console.log(error);
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

            //vacantes
            if (!(verificado = verify(this.state.num_vacantes, 1, "number"))) {
                errors.push("num_vacantes");
                this.setState({ num_vacantes: "Numero inválido" });
            } else {
                //this.setState({ num_vacantes_err: "" });
            }
            // eslint-disable-next-line
            if (this.state.num_vacantes == 0) {
                errors.push("num_vacantes");
                this.setState({ num_vacantes: "El número no puede ser 0" });
            } else {
                //this.setState({ num_vacantes_err: "" });
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

                try {
                    
                    let token = session.get()?.token;
                    let userType = session.get()?.userType;

                    let lBody = {
                        token: token,
                        userType: userType,
                        id: this.props.ofertaDetail?.id,
                        num_vacantes: this.state.num_vacantes,
                        description: this.state.description
                    };

                    await axios.post(getUrl(`/modOfertaE`), lBody);
                    

                    this.props.history.push(`/ofertas`);
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
            estiloError = "inputOferta";
        } else {
            estiloError = "inputOferta2";
        }

        for (let _y of this.state.errores) {
            // eslint-disable-next-line
            if (arg == [_y]) {
                // eslint-disable-next-line
                if (arg == [_y] && arg == "description") {
                    estiloError = "textAddInfo3";
                    return estiloError;
                }

                estiloError = "inputOferta3";
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

    verSuscritos() {
        //redireccionamos a candidaturas para empresa
        this.props.history.push(`/candidaturas?idoferta=${this.props.ofertaDetail?.id}`);
    }

    showButton() {
        // let visitor_name = session.get()?.visitor;
        const queries = queryString.parse(this.props.location.search);
        let id_empresa = this.props.ofertaDetail.idempresa;

        // eslint-disable-next-line
        if (id_empresa == queries.id && this.state.userType == "Empresa") {
            

            return (
                <Fragment>
                    <div className="botonesEditarEmpresa">
                        <button
                            // className={this.state.button}
                            className="blueButton2"
                            onClick={() => {
                                this.verSuscritos();
                            }}
                        >
                            Gestionar suscripciones
                        </button>
                        <button
                            // className={this.state.button}
                            className={this.state.button}
                            onClick={() => {
                                this.clickEditar();
                            }}
                        >
                            Editar
                        </button>
                    </div>
                </Fragment>
            );
        }
        // eslint-disable-next-line
        if (this.state.botonCandidato == true) {
            return (
                <Fragment>
                    <button
                        // className={this.state.button}
                        className="blueButton2"
                        onClick={() => {
                            this.suscribirse();
                        }}
                    >
                        Suscribirse
                    </button>
                </Fragment>
            );
        }
        return;
    }

    render() {
        return (
            <div>
                <div className="main">
                    <div className="mainOfertaDetail">
                        <div className="cardODetailHead">
                            <div className="ofertaHeadUp">
                                <div>
                                    <img className="ofertaHeadImg ml5 mt1" src={this.props.ofertaDetail?.picture ? this.props.ofertaDetail?.picture : "img/placeOffer.png"} alt="logoEmpresa" />
                                </div>
                                <div className="ofertaHeadUpText ml5">
                                    <div className="ofertaHeadUpTitulo mt3">{this.props.ofertaDetail?.titulo}</div>
                                    <div className="ofertaHeadUpEmpresa">{this.props.ofertaDetail?.name}</div>
                                    <div className="ofertaHeadUpTiempo">
                                        <p className="ofertaHeadUpTiempoText mt3">Publicada hace {this.state.publicada}</p>
                                        <p className="ofertaSuscritosText mt3">Suscritos a esta oferta: {this.state?.numSuscritos}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="ofertaHeadDown">
                                <div className="ofertaHeadDownU">
                                    <div className="ofertaHeadDownUText ml3">{this.props.ofertaDetail?.ciudad}</div>
                                    <div className="ofertaHeadDownUText ml3">{this.props.ofertaDetail?.tipo_contrato}</div>
                                    <div className="ofertaHeadDownUText2 ml3">Experiencia mín.: {this.state.experiencia}</div>
                                </div>
                                <div className="ofertaHeadDownD">
                                    <div className="ofertaHeadDownDText ml3">{this.props.ofertaDetail?.sector}</div>
                                    <div className="ofertaHeadDownDText ml3">{this.props.ofertaDetail?.salario}€</div>
                                </div>
                            </div>
                        </div>
                        <div className="cardODetailBody mt3">
                            <div className="descripcionOferta mr5">
                                <p className="cabeceraInput mb3">Descripcion de tu empresa</p>
                                <textarea
                                    className={`${this.errorCheck("description")}`}
                                    readOnly={this.state.readOnly}
                                    rows="7"
                                    cols="50"
                                    maxLength="2000"
                                    placeholder={this.state?.desription}
                                    name="description"
                                    value={this.state?.description}
                                    onChange={this.handleChange}
                                ></textarea>
                                <span id="descriptionRemainingCharacters"></span>
                            </div>
                            <div className="vacantesBox mb3">
                                <div className="vacantesTitle mt3">Vacantes: </div>
                                <input
                                    className={`${this.errorCheck("num_vacantes")} mt3`}
                                    readOnly={this.state.readOnly}
                                    placeholder={this.state?.num_vacantes}
                                    name="num_vacantes"
                                    value={this.state?.num_vacantes}
                                    onChange={this.handleChange}
                                ></input>
                            </div>
                            {this.showButton()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    // ese state es de redux
    return {
        ofertaDetail: state.ofertaDetail
    };
};

export default connect(mapStateToProps)(withRouter(OfertaDetail));
