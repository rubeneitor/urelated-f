import React, { Fragment } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import "./ofertas.scss";
import Search from "../../components/search/search";
import { rdx_ofertasResultadoEmpresa } from "../../redux/actions/ofertas";
import { session, getUrl, numToStr } from "../../utils/uti";
import Select from "react-select";


class Ofertas extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sort: "ra",
            minPrice: "",
            maxPrice: "",
            category: "",
            check1: false,

            productList: [],
            
        };
    }

    handleChangeDrop = ev =>{
    	// this.setState({[ev.target.name]: ev.target.type === 'number' ? +ev.target.value : ev.target.value}, () => {
    	// 	console.log("perrerete");
        // });
        // console.log(ev.target.name);
        
    };

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

            console.log(this.props.ofertasResultadoEmpresa.data);


        } catch (error) {
            console.log(error);
        }
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
        if (!this.props.ofertasResultadoEmpresa?.data || this.props.ofertasResultadoEmpresa?.data?.length === 0) {
            return (
                <Fragment>
                    <div className="cardOfertaNr mb3">
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
        ofertasResultadoEmpresa: state.ofertasResultadoEmpresa
    };
};

export default connect(mapStateToProps)(withRouter(Ofertas));
