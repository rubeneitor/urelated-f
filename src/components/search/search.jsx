import React from "react";
import Input from "../input/input";
import axios from "axios";
import { getUrl } from "../../utils/uti";
import "./search.scss";
import { rdx_ofertasResultado, rdx_homeSearch, getOfertasFiltradas } from "../../redux/actions/ofertas";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import store from "../../redux/store";

class Search extends React.Component {
    constructor (props) {
        super(props);
        this.state={
            puesto:'',
            lugar:''
        }
    };

    handleChange=(event)=> {
        // this.setState({[event.target.name]:event.target.value},()=> console.log(this.state))
        this.setState({[event.target.name]:event.target.value})
    }

    pulsaSearch() {

        // let filtrosHome = {
        //     puesto: this.state.puesto,
        //     lugar: this.state.lugar
        // };

        // let res = await axios.get(getUrl(`/searchHome?puesto=${this.props.filtrosHome?.puesto}&lugar=${this.props.filtrosHome?.lugar}`));
        getOfertasFiltradas(this.state.puesto, this.state.lugar).catch(error =>console.error(error));
        
        // rdx_ofertasResultado({
        //     // data: res.data
        // });

        this.props.history.push("/searchResults");
        // rdx_homeSearch({
        //     filtros: filtrosHome,
        // });

        // this.busquedaFiltrada();


        
    }

    busquedaFiltrada =async() =>{

        // let res = {};
        // console.log(this.props.filtros);
        // console.log(this.props.filtrosHome.filtros.puesto);
        // console.log(this.props.filtrosHome.filtros.lugar);
        
    //     try {

    //         // res = await axios.get(getUrl(`/searchHome?puesto=${this.state.puesto}&lugar=${this.state.lugar}`));
    //         res = await axios.get(getUrl(`/searchHome?puesto=${this.props.filtrosHome?.puesto}&lugar=${this.props.filtrosHome?.lugar}`));

    //     } catch (err) {
    //         res = err;
    //     }


        
    //     //guardamos los resultados en redux
    //     rdx_ofertasResultado({
	// 		data: res.data
    //     });

    //     this.setState({puesto: ''});
    //     this.setState({lugar: ''});

        //redireccion con los resultados
        // this.props.history.push("/searchResults");
    }

    render() {
        
        return (
            <div className="busqueda">
                <div className="search">
                    <Input
                        placeholder="Puesto, empresa o tipo de contrato"
                        handleChange={this.handleChange}
                        value={this.state.puesto}
                        name="puesto"
                    />

                    <Input
                    
                        placeholder="Ciudad o provincia"
                        handleChange={this.handleChange}
                        value={this.state.lugar}
                        name="lugar"
                    
                    />
                </div>
                <div className="buttonContainer">
                        <button className="searchButton" onClick={() => this.pulsaSearch()}>
                            Encuentra!
                        </button>
                    </div>
            </div>
        );
    }
}


const mapStateToProps = (state) => { // ese state es de redux
	return ({
        ofertasResultado: state.ofertasResultado,
        filtros: state.homeSearch?.filtros
    })
}


export default connect(mapStateToProps) (withRouter(Search));