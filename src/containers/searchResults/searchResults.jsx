import React, { Fragment } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import "./searchResults.scss";
import Search from "../../components/search/search";
import { rdx_ofertasResultado } from "../../redux/actions/ofertas";
import { getUrl, numToStr } from "../../utils/uti";
import Select from "react-select";


class SearchResults extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sort: "ra",
            minPrice: "",
            maxPrice: "",
            category: "",

            productList: [],
            selExp: "",
            selSal: "",
            selVac: "",
        };
    }

    handleChangeDrop = (ev, action) =>{
    	this.setState({[action.name]: ev.value}, () => {
            this.buscaFiltro();
    })};
        

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

    async buscaFiltro(){
        console.log("holaaaaaa");
    }

    componentDidUpdate() {
        this.render();
    }

    pulsaResultado(ofertaData) {
        console.log("SI TIO SI HAS PULSADO ESTA CARD ...QUE ES DE: ", ofertaData.titulo);
        // Guardo en redux
        //rdx_productDetail(productData);

        // Redirijo
        // this.props.history.push(`/detail?id=${productData._id}`);
    }

    muestraResultados() {
        if (!this.props.ofertasResultado?.data || this.props.ofertasResultado?.data?.length === 0) {
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
                {this.props.ofertasResultado?.data?.map(_x => {
                    return (
                        <div
                            className="cardOferta mb5"
                            key={_x.id + "," + _x.titulo}
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
                            <div className="radios"></div>
                            <div className="sel">
                                <Select name="selSal" onChange={this.handleChangeDrop}
                                options={[
                                        { value: "1", label: ">12.000€" },
                                        { value: "2", label: ">24.000€" },
                                        { value: "3", label: ">38.000€" },
                                    ]} />
                            </div>
                            <div className="sel">
                                <Select name="selVac" onChange={this.handleChangeDrop}
                                    options={[
                                        { value: "1", label: "Menos de 10" },
                                        { value: "2", label: "Menos de 100" },
                                        { value: "3", label: "Menos de 1000" },
                                    ]}
                                />
                            </div>
                            <div className="sel">
                                <Select name="selExp"  onChange={this.handleChangeDrop} options={[
                                        { value: "1", label: "1 año" },
                                        { value: "2", label: "2 años" },
                                        { value: "3", label: "5 años" },
                                        { value: "4", label: "+ de 5 años" }
                                    ]} />
                            </div>
                            {/* <div className="sel">
                            <select name="userGenre" onChange={this.handleChangeDrop}>
                                    <option value="0"></option>
                                    <option value="1">Masculino</option>
                                    <option value="2">Femenino</option>
                                </select>
                            </div> */}
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
        ofertasResultado: state.ofertasResultado
    };
};

export default connect(mapStateToProps)(withRouter(SearchResults));
