import React, { Fragment } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
// import axios from "axios";
import "./searchResults.scss";
import Search from "../../components/search/search";
import { getOfertasFiltradas } from "../../redux/actions/ofertas";
// import { rdx_ofertasResultado } from "../../redux/actions/ofertas";
// import { getUrl, numToStr } from "../../utils/uti";
import Select from "react-select";
import store from "../../redux/store";


class SearchResults extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selSal: "",
            selExp: "",
            selJor: "",
        };
    }

    handleChangeDrop = (ev, action) =>{
    	this.setState({[action.name]: ev.value}, () => {
            this.buscaFiltro();
    })};
        
    async buscaFiltro(){


        //obtenemos los dos parámetros de la última búsqueda realizada

        //aplicamos los filtros 
        let salario = this.state.selSal;
        let puesto = this.props.filtros?.puesto;
        let lugar = this.props.filtros?.lugar;

        getOfertasFiltradas(puesto,lugar,salario).catch(error =>console.error(error));
        
    }

    componentDidUpdate() {
        
        this.render();
        
    }

    componentDidMount(){
        // this.setState({selSal.value: ""});
        
    }

    pulsaResultado(ofertaData) {
        console.log("SI TIO SI HAS PULSADO ESTA CARD ...QUE ES DE: ", ofertaData.titulo);
        // Guardo en redux
        //rdx_productDetail(productData);

        // Redirijo
        // this.props.history.push(`/detail?id=${productData._id}`);
    }

    muestraResultados() {
        if (!this.props.ofertasResultado[0]) {
            return (
                <Fragment>
                    <div className="cardOfertaNr mb3">
                        <div className="noResults">
                            <img className="imgNoResults" src="img/magnifier.png" alt="logo2" />
                            <p className="mt3">Ups! No hemos encontrado ninguna oferta.</p>
                            <br />
                            <p>Danos otra oportunidad!</p>
                        </div>
                    </div>
                </Fragment>
            );
        }

        return (
            <Fragment>
                {this.props?.ofertasResultado.map(_x => {
                    return (
                        <div
                            className="cardOferta mb5"
                            key={_x.id + Math.random() * (1000 - 1) + 1}
                            onClick={() => {
                                this.pulsaResultado(_x);
                            }}
                        >
                            <div className="cardOfertaSide">
                                <img className="cardImage mt5" src="img/placeOffer.png" alt="oferta" />
                            </div>

                            <div className="cardOfertaBody ml3 mt5">
                                <h1 className="cardTitulo1">{_x.titulo}</h1>
                                <h2 className="cardTitulo2">{_x.sector}</h2>
                                <div className="placeDate">
                                    <p className="placeDateText mr3">{_x.ciudad}</p>
                                    <p className="placeDateText mr3">{_x.provincia}</p>
                                    <p className="placeDateText mr3">{_x.fecha_publi}</p>
                                </div>
                                <p className="cardDescription mt3 mr5">{_x.desc_general}</p>
                                <div className="salarioContrato mt3">
                                    <h3 className="cardTitulo3 mr5">{_x.tipo_contrato}</h3>
                                    <h3 className="cardTitulo3">{_x.salario}€</h3>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </Fragment>
        );
    }

    render() {
        return (
            <Fragment>
                <Search />
                <div className="main">
                    <div className="mainSearch">
                        <div className="searchColumn mt5 mr5">
                        <p className="estadoText ml5">Palabra clave</p>
                                <input
                                    className="ofertasDashInput ml5"
                                    maxLength="240"
                                    placeholder=""
                                    name="keyWord"
                                    value={this.state.keyWord}
                                    onChange={this.handleChange}
                                ></input>
                            <p className="estadoText ml5 mt5">Rango salarial</p>
                            <div className="sel">
                                <Select placeholder="" name="selSal" onChange={this.handleChangeDrop}
                                options={[
                                        { value: "12000", label: ">12.000€" },
                                        { value: "24000", label: ">24.000€" },
                                        { value: "38000", label: ">38.000€" },
                                    ]} />
                            </div>
                            <p className="estadoText ml5 mt5">Años de experiencia</p>
                            <div className="sel">
                                <Select placeholder="" name="selExp" onChange={this.handleChangeDrop} options={[
                                        { value: "1", label: "1 año" },
                                        { value: "2", label: "2 años" },
                                        { value: "3", label: "5 años" },
                                        { value: "4", label: "+ de 5 años" }
                                    ]} />
                            </div>
                            <p className="estadoText ml5 mt5">Jornada</p>
                            <div className="sel">
                                <Select placeholder="" name="selJor" onChange={this.handleChangeDrop} options={[
                                        { value: "1", label: "Completa" },
                                        { value: "2", label: "Media Jornada" },
                                        { value: "3", label: "Teletrabajo" },
                                     ]} />
                            </div>
                        </div>
                        <div className="resultsColumn mr5 mt5">
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
        ofertasResultado: state.ofertas,
        filtros: state.filtros,
    };
};

export default connect(mapStateToProps)(withRouter(SearchResults));
