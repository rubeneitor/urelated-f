import React, { Fragment } from "react";
import { session, getUrl } from "../../utils/uti";
import axios from "axios";
import queryString from "query-string";
import "./candidaturas.scss";
import Select from "react-select";
import store from "../../redux/store";

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
            ofeStaU: "",
            loading: true
        };
    }

    handleChangeDrop = (ev, action) => {
        this.setState({ [action.name]: ev.value }, () => {});
    };

    handleChangeDropU = (ev, action) => {
        this.setState({ [action.name]: ev.value }, () => {
            this.buscaFiltro();
        });
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

    async buscaFiltro() {
        //activas orden estado palabra clave

        let estado = this.state.ofeStaU;

        let id_usuario = session.get()?.visitor_id;

        //llamada a axios con la query
        const res = await axios.get(getUrl(`/suscripcionesPorU?id_usuario=${id_usuario}&estado=${estado}`));

        this.setState({ suscripcionesCandidato: res.data }, () => {});
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
                
                window.location.reload(false);
               
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

    linkEmpresa(datosEmpresa) {
        let empresa_name = datosEmpresa.name;
        let id_empresa = datosEmpresa.idempresa;

        this.props.history.push(`profileE?id=${id_empresa}&name=${empresa_name}`);
    }

    perfilCandidato(datosCandidato){
        

        let id_visitor = datosCandidato.id;
        let profileName = datosCandidato.name;

        this.props.history.push(`profileC?id=${id_visitor}&name=${profileName}`);

    }

    async linkOferta(datosOferta) {
        let idoferta = datosOferta.idoferta;

        try {
            //buscamos la oferta por id de oferta

            const res = await axios.get(getUrl(`/ofertaId/${idoferta}`));
            const busqueda = res.data[0];

            // Guardo en redux
            store.dispatch({
                type: "OFERTA_DETAIL",
                payload: busqueda
            });

        } catch (error) {
            console.log(error);
        }

        let id_visitor = session.get()?.visitor_id;
        let profileName = session.get()?.visitor;

        this.props.history.push(`/ofertaDetail?id=${id_visitor}&name=${profileName}`);
    }

    colorEstado(argColor) {

        //asignacion de estilo (scss) según estado de la candidatura
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
        // eslint-disable-next-line
        if (this.state.loading == true) {
            return (
                <Fragment>
                    <div>
                        <div className="main">
                            <div className="mainCandidaturasEmpresa">
                                <img className="spinnerImg" src="img/spinner.gif" alt="spinnerCargaE" />
                            </div>
                        </div>
                    </div>
                </Fragment>
            );
        }
        // eslint-disable-next-line
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
        // eslint-disable-next-line
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
                                        <p onClick={()=>{this.perfilCandidato(_x)}} className="datosCandidatoELink mr5">{_x.name} {_x.surname}</p>
                                                    {/* <p className="datosCandidato mr7">{_x.surname}</p> */}
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
        // eslint-disable-next-line
        if (this.state.loading == true) {
            return (
                <Fragment>
                    <div>
                        <div className="main">
                            <div className="mainCandidaturasCandidato">
                                <img className="spinnerImg" src="img/spinner.gif" alt="spinnerCandidato" />
                            </div>
                        </div>
                    </div>
                </Fragment>
            );
        }
        // eslint-disable-next-line
        if (!this.state.suscripcionesCandidato[0] && this.state.loading == false) {
            return (
                <Fragment>
                    <div>
                        <div className="main">
                            <div className="mainCandidaturasCandidato">
                                <div className="noCandidaturas">
                                    <p className="sinCandidatos">No hay candidaturas que mostrar con este criterio.</p>
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
        // eslint-disable-next-line
        if (this.state.suscripcionesCandidato[0] && this.state.loading == false) {
            return (
                <Fragment>
                    <div>
                        <div className="main">
                            <div className="mainCandidaturasCandidato">
                                <div className="columnEstado mt5">
                                    <p className="filtroEstadoCandidato ml5 mt5">Busca por estado:</p>
                                    <div className="sel ml5 mt5">
                                        <Select
                                            // placeholder={this.state.selectEstado[_x.estado]}
                                            name="ofeStaU"
                                            onChange={this.handleChangeDropU}
                                            options={[
                                                { value: "1", label: "Revisando" },
                                                { value: "2", label: "Aceptada" },
                                                { value: "3", label: "Rechazada" }
                                            ]}
                                        />
                                    </div>
                                </div>
                                <div className="columnMisCandidaturas ml5 mt5">
                                    {this.state.suscripcionesCandidato?.map(_x => {
                                        return (
                                            <div className="cardCandidaturaUser mb5" key={_x.id + Math.random() * (1000 - 1) + 1}>
                                                <div className="datosCardCandidatura">
                                                    <p
                                                        onClick={() => {
                                                            this.linkEmpresa(_x);
                                                        }}
                                                        className="datosCandidatoELink mr3"
                                                    >
                                                        {_x.name}
                                                    </p>
                                                    <p
                                                        onClick={() => {
                                                            this.linkOferta(_x);
                                                        }}
                                                        className="datosCandidatoELink mr3"
                                                    >
                                                        {_x.titulo}
                                                    </p>
                                                    <p className="datosCandidato mr3">{_x.ciudad}</p>
                                                    <p className="datosCandidato mr3">{_x.tipo_contrato}</p>
                                                    <p className="datosCandidato mr3">{_x.fecha_sus}</p>
                                                </div>
                                                <div className="eliminarCandidatura">
                                                    <p className={this.colorEstado(_x.estado)}>{this.state.selectEstado[_x.estado]}</p>

                                                    <button
                                                        onClick={() => {
                                                            this.clickEliminar(_x.idsuscrip);
                                                        }}
                                                        className="redButton ml5"
                                                    >
                                                        Eliminar
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

    render() {
        if (this.state.userType === "Empresa") {
            return <Fragment>{this.muestraResultadoE()}</Fragment>;
        } else {
            return <Fragment>{this.muestraResultadoU()}</Fragment>;
        }
    }
}

export default Candidaturas;
