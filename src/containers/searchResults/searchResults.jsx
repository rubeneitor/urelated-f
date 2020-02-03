import React, { Fragment } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import "./searchResults.scss";
import Search from "../../components/search/search";
import { getOfertasFiltradas } from "../../redux/actions/ofertas";
import { session } from "../../utils/uti";
import Select from "react-select";
import store from "../../redux/store";

class SearchResults extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            
            selSal: "",
            selExp: "",
            selJor: "",
            keyWord: "",

            image: "img/placeOffer.png"
        };

        this.buscaFiltro = this.buscaFiltro.bind(this);
    }

    handleChange = ev => {
        this.setState({ [ev.target.name]: ev.target.type === "number" ? +ev.target.value : ev.target.value });
    };

    handleChangeDrop = (ev, action) => {
        this.setState({ [action.name]: ev.value }, () => {
            this.buscaFiltro();
        });
    };

    pulsaKeyword (){
        this.buscaFiltro();
    }

    async buscaFiltro() {
        
        //obtenemos los dos parámetros de la última búsqueda realizada
        //aplicamos los filtros
        let salario = this.state.selSal;
        let puesto = this.props.filtros?.puesto;
        let lugar = this.props.filtros?.lugar;
        let experiencia = this.state.selExp;
        let jornada = this.state.selJor;
        let keyWord = this.state.keyWord;

        getOfertasFiltradas(puesto, lugar, salario, experiencia, jornada, keyWord).catch(error => console.error(error));
    }

    componentDidUpdate() {
        this.render();
    }

    pulsaResultado(ofertaData) {
        // Guardo en redux
        store.dispatch({
            type: "OFERTA_DETAIL",
            payload: ofertaData
        });

        // Redirijo

        let id_visitor = session.get()?.visitor_id;
        let profileName = session.get()?.visitor;

        this.props.history.push(`/ofertaDetail?id=${id_visitor}&name=${profileName}`);
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
                                <img className="cardImage mt5" src={_x.picture ? _x.picture : "img/placeOffer.png"} alt="oferta" />
                            </div>

                            <div className="cardOfertaBody ml3 mt5">
                                <h1 className="cardTitulo1">{_x.titulo}</h1>
                                <h2 className="cardTitulo2">{_x.sector}</h2>
                                <div className="placeDate">
                                    <p className="placeDateText mr3">{_x.ciudad}</p>
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
                            <div>
                                <input className="ofertasDashInput ml5" maxLength="240" placeholder="" name="keyWord" value={this.state.keyWord} onChange={this.handleChange}></input>
                                <button onClick={() => {
                                    this.pulsaKeyword();
                                }}>Go!</button>
                            </div>

                            <p className="estadoText ml5 mt5">Rango salarial</p>
                            <div className="sel">
                                <Select
                                    placeholder=""
                                    name="selSal"
                                    onChange={this.handleChangeDrop}
                                    options={[
                                        { value: "12000", label: ">12.000€" },
                                        { value: "24000", label: ">24.000€" },
                                        { value: "38000", label: ">38.000€" }
                                    ]}
                                />
                            </div>
                            <p className="estadoText ml5 mt5">Años de experiencia</p>
                            <div className="sel">
                                <Select
                                    placeholder=""
                                    name="selExp"
                                    onChange={this.handleChangeDrop}
                                    options={[
                                        { value: "", label: "" },
                                        { value: "1", label: "1 año" },
                                        { value: "2", label: "2 años" },
                                        { value: "3", label: "5 años" },
                                        { value: "4", label: "+ de 5 años" }
                                    ]}
                                />
                            </div>
                            <p className="estadoText ml5 mt5">Jornada</p>
                            <div className="sel">
                                <Select
                                    placeholder=""
                                    name="selJor"
                                    onChange={this.handleChangeDrop}
                                    options={[
                                        { value: "Completa", label: "Completa" },
                                        { value: "Media Jornada", label: "Media Jornada" },
                                        { value: "Teletrabajo", label: "Teletrabajo" }
                                    ]}
                                />
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
        filtros: state.filtros
    };
};

export default connect(mapStateToProps)(withRouter(SearchResults));
