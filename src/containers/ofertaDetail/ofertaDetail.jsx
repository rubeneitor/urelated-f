import React, { Fragment } from "react";
import "./ofertaDetail.scss";
import { session, getUrl } from "../../utils/uti";
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

            picture: "",
            titutlo: "",
            name: "",
            ciudad: "",
            sector: "",
            salario: "",
            tipo_contrato: "",
            num_vacantes: "",
            exp_requerida: "",
            desc_general: ""
        };
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

            if (!this.props.ofertaDetail?.desc_general) {
                
                descripcionNull = "Oferta sin descripción general";
            }else {
                descripcionNull = this.props.ofertaDetail?.desc_general;
            }

            let now = Date();

            let publicada = moment(now).diff(this.props.ofertaDetail?.created_at, "hours");

            this.setState(
                {
                    // detailOferta: this.props.ofertaDetail,

                    picture: this.props.ofertaDetail?.picture,
                    titulo: this.props.ofertaDetail?.titulo,
                    name: this.props.ofertaDetail?.name,
                    ciudad: this.props.ofertaDetail?.ciudad,
                    sector: this.props.ofertaDetail?.sector,
                    salario: this.props.ofertaDetail?.salario,
                    tipo_contrato: this.props.ofertaDetail?.tipo_contrato,
                    num_vacantes: this.props.ofertaDetail?.num_vacantes,
                    exp_requerida: this.props.ofertaDetail?.exp_requerida,
                    desc_general: descripcionNull,
                    publicada: publicada
                },
                () => {}
            );

            

            const res = await axios.get(getUrl(`/numSuscritos?id_oferta=${id_oferta}`));

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
        //eres la empresa que ha publicado esta oferta y tienes permiso para editarla
        console.log("NAAAAAAAADA");
    }

    verSuscritos () {
        console.log("VETE A VER LOS SUSCRITOS ANDA Y VE");
    }

    showButton() {
        let visitor_name = session.get()?.visitor;
        const queries = queryString.parse(this.props.location.search);
        let id_empresa = this.props.ofertaDetail.idempresa;

        // eslint-disable-next-line
        if (id_empresa == queries.id && this.state.userType == "Empresa") {
            // en caso de ser la empresa que ha publicado la oferta, puedo ver también los nombres de todos los inscritos y
            //links a sus perfiles

            return (
                <Fragment>
                    <div className="botonesEditarEmpresa">
                        <button
                            // className={this.state.button}
                            className="button mr5"
                            onClick={() => {
                                this.verSuscritos();
                            }}
                        >
                            Ver suscritos a esta oferta
                        </button>
                        <button
                            // className={this.state.button}
                            className="button"
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

        if (this.state.botonCandidato == true) {
            return (
                <Fragment>
                    <button
                        // className={this.state.button}
                        className="button"
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
                                    <img className="ofertaHeadImg ml5 mt1" src={this.state?.picture} alt="logoEmpresa" />
                                </div>
                                <div className="ofertaHeadUpText mt5 ml3">
                                    <div className="ofertaHeadUpTitulo">{this.state?.titulo}</div>
                                    <div className="ofertaHeadUpEmpresa">{this.state?.name}</div>
                                    <div className="ofertaHeadUpTiempo">
                                        <p className="ofertaHeadUpTiempoText">Publicada hace {this.state.publicada} horas.</p>
                                        <p classname="mt1">Suscritos a esta oferta: {this.state?.numSuscritos}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="ofertaHeadDown">
                                <div className="ofertaHeadDownU">
                                    <div className="ofertaHeadDownUText">{this.state?.ciudad}</div>
                                    <div className="ofertaHeadDownUText">{this.state?.tipo_contrato}</div>
                                    <div className="ofertaHeadDownUText">Vacantes: {this.state?.num_vacantes}</div>
                                </div>
                                <div className="ofertaHeadDownD mt1">
                                    <div className="ofertaHeadDownDText">{this.state?.sector}</div>
                                    <div className="ofertaHeadDownDText">{this.state?.salario}€</div>
                                    <div className="ofertaHeadDownDText">Experiencia mín.: {this.state?.exp_requerida} año/s</div>
                                </div>
                            </div>
                        </div>
                        <div className="cardODetailBody mt3">
                            <div className="descripcionOferta mr5">
                                <p className="cabeceraInput mb3">Descripcion de tu empresa</p>
                                <textarea
                                    // className={`${this.errorCheck("description")}`}
                                    className="textAddInfo"
                                    readOnly={this.state.readOnly}
                                    rows="7"
                                    cols="50"
                                    maxLength="2000"
                                    placeholder={this.state?.desc_general}
                                    name="desc_general"
                                    value={this.state?.desc_general}
                                    onChange={this.handleChange}
                                ></textarea>
                                <span id="descriptionRemainingCharacters"></span>
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
