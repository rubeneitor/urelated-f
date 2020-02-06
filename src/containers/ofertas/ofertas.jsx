import React, { Fragment } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import "./ofertas.scss";
import { rdx_ofertasResultadoEmpresa } from "../../redux/actions/ofertas";
import { session, getUrl } from "../../utils/uti";
import Select from "react-select";
import store from "../../redux/store";


class Ofertas extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            check1: false,
            check2: false,
            keyWord: "",
            ofeSta: "",
        };
    }

    handleChangeDrop = (ev, action) =>{
    	this.setState({[action.name]: ev.value}, () => {
            this.buscaFiltro();
        });
    };

    handleChangeCheck = ev => {
        this.setState({ [ev.target.name]: ev.target.type === "number" ? +ev.target.checked : ev.target.checked },() => {

            this.buscaFiltro();
        });

    };

    handleChange = (ev) =>{
        this.setState({ [ev.target.name]: ev.target.type === "number" ? +ev.target.value : ev.target.value },() => {

            this.buscaFiltro();
        });

    };

    async buscaFiltro() {
        //activas orden estado palabra clave
        let activas = this.state.check1;
        let orden = this.state.check2;
        let estado = this.state.ofeSta;
        let keyword = this.state.keyWord;
        let id = session.get()?.visitor_id;

        // eslint-disable-next-line
        if (this.state.check1 == false) {
            activas = "";
        }else{
            activas = 1;
        }
        
        // eslint-disable-next-line
        if(this.state.check2 == false) {
            orden = "";
        }

        

        //llamada a axios con la query 
        const res = await axios.get(getUrl(`/ofertasPorEmp?id=${id}&activas=${activas}&orden=${orden}&estado=${estado}&keyword=${keyword}`));
        
        rdx_ofertasResultadoEmpresa({
            data: res.data
        });
    
    }

    async componentDidMount() {
        //buscamos las ofertas según id de empresa y guardamos en redux

        try {

            //axios incoming...

            let id = session.get()?.visitor_id;

            const res = await axios.get(getUrl(`/ofertasPorE/${id}`));

            //rdx almacenando... 

            rdx_ofertasResultadoEmpresa({
                data: res.data
            });

        } catch (error) {
            console.log(error);
        }
    }

    componentDidUpdate() {
        this.render();
    }

    pulsaResultado(ofertaData) {

        // Guardo en redux
        store.dispatch({
            type: 'OFERTA_DETAIL',
            payload: ofertaData
        });

        // Redirijo
        
        let id_visitor = session.get()?.visitor_id;
        let profileName = session.get()?.visitor;

        this.props.history.push(`/ofertaDetail?id=${id_visitor}&name=${profileName}`);
    }

    muestraResultados() {
        if (!this.props.ofertasResultadoEmpresa?.data || this.props.ofertasResultadoEmpresa?.data?.length === 0) {
            return (
                <Fragment>
                    <div className="cardOfertaNr mb3 mt5 ml5">
                        <div className="noResults">
                            <img className="imgNoResults" src="img/magnifier.png" alt="logo2" />
                            <p className="mt3">Vaya! Aun no has publicado ninguna oferta.</p>
                            <br />
                            <p>¿Porque no publicas una y empiezas a contactar candidatos?.</p>
                        </div>
                    </div>
                </Fragment>
            );
        }

        return (
            <Fragment>
                <div className="ofertasContainer">
                {this.props.ofertasResultadoEmpresa?.data?.map(_x => {
                    return (
                        
                        <div
                            className="cardOfertaEmpresa mb5"
                            key={_x.id + "," + _x.titulo}
                            onClick={() => {
                                this.pulsaResultado(_x);
                            }}
                        >   <div className="cardOfertaBody ml3 mt5">
                                <h1 className="cardTitulo1">{_x.titulo}</h1>
                                <h2 className="cardTitulo2">{_x.sector}</h2>
                                <div className="placeDate">
                                    <p className="placeDateText mr3">{_x.ciudad}</p>
                                    <p className="placeDateText mr3">{_x.fecha_publi}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
                </div>
            </Fragment>
        );
    }

    nuevaOferta () {
        //redireccion a la vista de creacion de ofertas
        
        this.props.history.push(`/addOferta`);
    }

    render() {
        return (
            <Fragment>
                <div className="main">
                    <div className="mainSearchEmpresa">
                        <div className="searchColumn mt5">
                            <div className="ordenaOfertas">
                                <p className="encuentraText ml5 mt5">Encuentrame ofertas</p>
                                <div className="checkBoxContainer ml5 mt5">
                                    <label className="container">
                                    Sólo ofertas activas
                                    <input type="checkbox" name="check1" value={this.state.check1} onChange={this.handleChangeCheck}></input>
                                    <span className="checkmark"></span>
                                    </label>
                                </div>
                                <div className="checkBoxContainer ml5 mt5">
                                    <label className="container">
                                    Orden fecha descendente
                                    <input type="checkbox" name="check2" value={this.state.check2} onChange={this.handleChangeCheck}></input>
                                    <span className="checkmark"></span>
                                    </label>
                                </div>
                                <p className="estadoText ml5 mt5">Estado</p>
                                <div className="sel mt1">
                                <Select placeholder="" name="ofeSta" onChange={this.handleChangeDrop} options={[
                                        { value: "1", label: "Revisando" },
                                        { value: "2", label: "Aceptada" },
                                        { value: "3", label: "Rechazada" }
                                    ]} />
                                </div>
                                <p className="estadoText ml5 mt5">Palabra clave</p>
                                <input
                                    className="ofertasDashInput ml5"
                                    maxLength="240"
                                    placeholder=""
                                    name="keyWord"
                                    value={this.state.keyWord}
                                    onChange={this.handleChange}
                                ></input>
                                <button
                            className="blueButton"
                            onClick={() => {
                                this.nuevaOferta();
                            }}
                        >
                            Crea una oferta
                        </button>
                            </div>
                        </div>
                        <div className="resultsColumn mr5">
                            <div>{this.muestraResultados()}</div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => {
    // ese state es de redux
    return {
        //ofertasResultado: state.ofertasResultado,
        ofertasResultadoEmpresa: state.ofertasResultadoEmpresa,

    };
};

export default connect(mapStateToProps)(withRouter(Ofertas));
