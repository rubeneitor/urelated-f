import React, { Fragment } from "react";
import "./ofertaDetail.scss";
import { session, getUrl } from "../../utils/uti";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import queryString from "query-string";
import axios from "axios";
import moment from 'moment';
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

            let now = Date();
            
            let publicada = moment(now).diff(this.props.ofertaDetail?.created_at, 'hours');
            
            this.setState({ 
                detailOferta: this.props.ofertaDetail,
                publicada: publicada,
            
            }, () => {});

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
                    <button
                        // className={this.state.button}
                        className="button"
                        onClick={() => {
                            this.clickEditar();
                        }}
                    >
                        Editar
                    </button>
                    <button
                        // className={this.state.button}
                        className="button"
                        onClick={() => {
                            this.verSuscritos();
                        }}
                    >
                        Suscritos a esta oferta
                    </button>
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

    muestraData() {
        return <Fragment>{/* <p>{this.state?.numSuscritos}</p> */}</Fragment>;
    }

    render() {
        return (
            <div>
                <div className="main">
                    <div className="mainOfertaDetail">
                        <div className="cardODetailHead">
                            <div className="ofertaHeadUp">
                                <div>
                                    <img className="ofertaHeadImg ml5 mt3" src={this.state.detailOferta?.picture} alt="logoEmpresa" />
                                </div>
                                <div className="ofertaHeadUpText mt5 ml3">
                                    <div className="ofertaHeadUpTitulo">{this.state.detailOferta?.titulo}</div>
                                    <div className="ofertaHeadUpEmpresa">{this.state.detailOferta?.name}</div>
                                    <div className="ofertaHeadUpTiempo">
                                        <p>Publicada hace {this.state.publicada} horas.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="ofertaHeadDown"></div>
                        </div>
                        <div className="cardODetailBody mt3">{this.showButton()}</div>
                    </div>
                </div>
                {/* {this.muestraData()} */}
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
