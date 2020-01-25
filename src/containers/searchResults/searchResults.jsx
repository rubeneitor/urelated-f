import React, { Fragment } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import "./searchResults.scss";
import Search from "../../components/search/search";
import { rdx_ofertasResultado } from "../../redux/actions/ofertas";
import { getUrl, numToStr } from "../../utils/uti";
import DropdownCategories from "../../components/dropdownCategories/dropdownCategories";

class SearchResults extends React.Component {
    constructor(props) {
        super(props);

        // this.state = {

        // 	sort: "ra",
        // 	minPrice: "",
        // 	maxPrice: "",
        // 	category: "",

        // 	productList: [],
        // }
    }

    // handleChangeDropdown = (ev) =>{
    // 	this.setState({[ev.target.name]: ev.target.type === 'number' ? +ev.target.value : ev.target.value}, () => {
    // 		this.llamaAxios();
    // 	});
    // };

    // handleChangePrice = (ev, nombreEstado) => {
    // 	this.setState({[nombreEstado]: ev.target.type === 'number' ? +ev.target.value : ev.target.value}, () => {
    // 		this.llamaAxios();
    // 	});
    // };

    // pulsaSort(tipo) {
    // 	this.setState({ sort: tipo }, () => {
    // 		this.llamaAxios();
    // 	});
    // };

    // llamaAxios() {

    // 	let queryTitle = `title=${this.props.productSearchResults?.keywords}`;
    // 	let querySort = `sort=${this.state.sort}`;
    // 	let queryCategory = `category=${this.state.category}`;
    // 	let queryMinPrice = `minPrice=${this.state.minPrice}`;
    // 	let queryMaxPrice = `maxPrice=${this.state.maxPrice}`;

    // 	axios.get( getUrl(`/product/get?${queryTitle}&${querySort}&${queryCategory}&${queryMinPrice}&${queryMaxPrice}`) ).then( (res) => {

    // 		// rdx_productSearchResults({
    // 		// 	keywords: this.props.productSearchResults.keywords,
    // 		// 	data: res.data
    // 		// });

    // 	}).catch( (err) => {
    // 		console.log( err );
    // 	});

    // };

    componentDidUpdate() {
        this.render();
    }

    //pulsaResultado(productData) {
    pulsaResultado(ofertaData) {
        console.log("SI TIO SI HAS PULSADO ESTA CARD ...QUE ES DE: ",ofertaData.titulo);
        // Guardo en redux
        //rdx_productDetail(productData);

        // Redirijo
        // this.props.history.push(`/detail?id=${productData._id}`);
    }

    muestraResultados() {
        if (!this.props.ofertasResultado?.data || this.props.ofertasResultado?.data?.length === 0) {
            return (
                <Fragment>
                    <div className="cardOferta mb3">
                        <div className="noResults">
                            <p>Ups! No hemos encontrado ninguna oferta.</p>
                            <br />
                            <p>Danos otra oportunidad!.</p>
                        </div>
                    </div>
                </Fragment>
            );
        }

        return (
            <Fragment>
                {this.props.ofertasResultado?.data?.map(_x => {
                    return (
                        <div
                            className="cardOferta mb5"
                            key={_x.id+","+_x.titulo}
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
                        <div className="searchColumn mt5 mr5"></div>
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
        ofertasResultado: state.ofertasResultado
    };
};

export default connect(mapStateToProps)(withRouter(SearchResults));
