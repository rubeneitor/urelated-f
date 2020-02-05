import React, { Fragment } from "react";
import { session, getUrl } from "../../utils/uti";
import axios from "axios";
import queryString from "query-string";
import "./candidaturas.scss";
import Select from "react-select";

class Candidaturas extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userType: session.get()?.userType,
            ofertasEmpresaInfo: "",
            suscripcionesCandidato: "",
            selectEstado: {
                1: "Revisando",
                2: "Aceptada",
                3: "Rechazada"
            },
            ofeSta: "",
            loading: true
        };
    }

    handleChangeDrop = (ev, action) => {
        this.setState({ [action.name]: ev.value }, () => {});
    };

    async componentDidMount() {
        //comprobamos si se trata de una empresa o un candidato
        if (this.state.userType === "Empresa") {
            //buscamos las candidaturas por empresa y la id de oferta
            const queries = queryString.parse(this.props.location.search);

            try {
                const res = await axios.get(getUrl(`/suscripcionesPorE?id_oferta=${queries.idoferta}`));

                this.setState({ ofertasEmpresaInfo: res.data }, () => {});

                this.setState({ loading: false });
            } catch (error) {
                console.log(error);
            }
            //axios...
        } else {
            //buscamos las candidaturas por candidato
            const id_usuario = session.get()?.visitor_id;

            //axios...

            try {
                const res = await axios.get(getUrl(`/suscripcionesPorU?id_usuario=${id_usuario}`));

                this.setState({ suscripcionesCandidato: res.data }, () => {});

                this.setState({ loading: false });
            } catch (error) {
                console.log(error);
            }
        }
    }

    componentDidUpdate() {
        this.render();
    }

    async editarEstado(id) {
        //axios edicion de estado en la suscripción
        let bodySusMod = {
            id_suscripcion: id,
            estado: this.state.ofeSta
        };

        let idOferta = this.state.ofertasEmpresaInfo[0].id;

        try {
            await axios.post(getUrl(`/modSuscripcion`), bodySusMod);

            //redirigimos
            setTimeout(() => {
                this.props.history.push(`/candidaturas?idoferta=${idOferta}`);
            }, 500);
        } catch (error) {
            console.log(error);
        }
    }

    async clickEliminar(id) {
        let idSuscripcion = id;

        try {
            await axios.post(getUrl(`/delSuscripcion?id_suscripcion=${idSuscripcion}`));

            //redirigimos
            setTimeout(() => {
                this.props.history.push(`/`);
            }, 500);
        } catch (error) {
            console.log(error);
        }
    }

    clickVolver() {
        if (this.state.userType === "Empresa") {
            this.props.history.push(`/ofertas`);
        } else {
            this.props.history.push(`/`);
        }
    }

    colorEstado(argColor) {
        switch (argColor) {
            case 1:
              return "colorDelEstadoN";
            case 2:
                return "colorDelEstadoV";
            case 3:
                return "colorDelEstadoR";
            
            default:
              console.log("error");
          }
    }

    muestraResultadoE() {
        if (!this.state.ofertasEmpresaInfo[0] && this.state.loading == false) {
            return (
                <Fragment>
                    <div>
                        <div className="main">
                            <div className="mainCandidaturasEmpresa">
                                <div className="noCandidaturas">
                                    <p className="sinCandidatos">Vaya, aun no hay candidatos inscritos a esta oferta.</p>
                                    <button
                                        onClick={() => {
                                            this.clickVolver();
                                        }}
                                        className="blueButton mt5"
                                    >
                                        Volver
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Fragment>
            );
        }

        if (this.state.ofertasEmpresaInfo[0] && this.state.loading == false) {
            return (
                <Fragment>
                    <div>
                        <div className="main">
                            <div className="mainCandidaturasEmpresa">
                                <div className="columnOfertaInfo mt5">
                                    <div className="ofertaIContenedor mt5 ml5">
                                        <p className="tituloInfo mr3">Puesto:</p>
                                        <p className="infoOferta ">{this.state.ofertasEmpresaInfo[0].titulo}</p>
                                    </div>
                                    <div className="ofertaIContenedor mt5 ml5">
                                        <p className="tituloInfo mr3">Publicación:</p>
                                        <p className="infoOferta ">{this.state.ofertasEmpresaInfo[0].fecha_publi}</p>
                                    </div>
                                    <div className="ofertaIContenedor mt5 ml5">
                                        <p className="tituloInfo mr3">Ciudad:</p>
                                        <p className="infoOferta ">{this.state.ofertasEmpresaInfo[0].ciudad}</p>
                                    </div>
                                    <div className="ofertaIContenedor mt5 ml5">
                                        <p className="tituloInfo mr3">Sector:</p>
                                        <p className="infoOferta ">{this.state.ofertasEmpresaInfo[0].sector}</p>
                                    </div>
                                </div>
                                <div className="columnCandidatos ml5 mt5">
                                    {this.state.ofertasEmpresaInfo.map(_x => {
                                        return (
                                            <div className="cardCandidatura mb5" key={_x.id + "," + _x.titulo}>
                                                <div className="datosCardCandidatura">
                                                    <p className="datosCandidato mr2">{_x.name}</p>
                                                    <p className="datosCandidato mr7">{_x.surname}</p>
                                                    <p className="datosCandidato mr5">{_x.usuciudad}</p>
                                                    <p className="datosCandidato mr9">{_x.fecha_sus}</p>
                                                </div>

                                                <div className="editorEstado ml1">
                                                    <div className="sel ml5">
                                                        <Select
                                                            placeholder={this.state.selectEstado[_x.estado]}
                                                            name="ofeSta"
                                                            onChange={this.handleChangeDrop}
                                                            options={[
                                                                { value: "1", label: "Revisando" },
                                                                { value: "2", label: "Aceptada" },
                                                                { value: "3", label: "Rechazada" }
                                                            ]}
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            this.editarEstado(_x.idsuscrip);
                                                        }}
                                                        className="blueButton2 ml5"
                                                    >
                                                        Cambiar estado
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div className="cardCandidaturaFinal mt5">
                                        <button
                                            onClick={() => {
                                                this.clickVolver();
                                            }}
                                            className="blueButton"
                                        >
                                            Volver
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Fragment>
            );
        }
    }

    muestraResultadoU() {
        if (!this.state.suscripcionesCandidato[0] && this.state.loading == false) {
            return (
                <Fragment>
                    <div>
                        <div className="main">
                            <div className="mainCandidaturasCandidato">
                                <div className="noCandidaturas">
                                    <p className="sinCandidatos">Aun no te has suscrito a ninguna candidatura.</p>
                                    <button
                                        onClick={() => {
                                            this.clickVolver();
                                        }}
                                        className="blueButton mt5"
                                    >
                                        Volver
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Fragment>
            );
        }

        if (this.state.suscripcionesCandidato[0] && this.state.loading == false) {
            return (
                <Fragment>
                    <div>
                        <div className="main">
                            <div className="mainCandidaturasCandidato">
                                <div className="columnEstado mt5"></div>
                                <div className="columnMisCandidaturas ml5 mt5">
                                    {this.state.suscripcionesCandidato?.map(_x => {
                                        return (
                                            <div
                                                className="cardCandidaturaUser mb5"
                                                key={_x.id + Math.random() * (1000 - 1) + 1}
                                                
                                            >
                                                <div className="datosCardCandidatura">
                                                    <p className="datosCandidato mr3">{_x.name}</p>
                                                    <p className="datosCandidato mr3">{_x.titulo}</p>
                                                    <p className="datosCandidato mr3">{_x.ciudad}</p>
                                                    <p className="datosCandidato mr3">{_x.tipo_contrato}</p>
                                                    <p className="datosCandidato mr3">{_x.fecha_sus}</p>
                                                </div>
                                                <div className="eliminarCandidatura">
                                                <p className={this.colorEstado(_x.estado)}>{this.state.selectEstado[_x.estado]}</p>

                                                    <button onClick={() => {
                                                this.clickEliminar(_x.idsuscrip);
                                            }}
                                            className="redButton ml5">Eliminar</button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div className="cardCandidaturaFinal mt5">
                                        <button
                                            onClick={() => {
                                                this.clickVolver();
                                            }}
                                            className="blueButton"
                                        >
                                            Volver
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Fragment>
            );
        }
    }

    render() {
        if (this.state.userType === "Empresa") {
            return <Fragment>{this.muestraResultadoE()}</Fragment>;
        } else {
            return <Fragment>{this.muestraResultadoU()}</Fragment>;
        }
    }
}

export default Candidaturas;
