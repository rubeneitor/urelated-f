import React from "react";
import Input from "../input/input";
// import axios from "axios";
// import { getUrl } from "../../utils/uti";
import "./search.scss";
// import { rdx_ofertasResultado, rdx_homeSearch, getOfertasFiltradas } from "../../redux/actions/ofertas";
import { getOfertasFiltradas } from "../../redux/actions/ofertas";
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

        let filtroBusca = {
            puesto: this.state.puesto,
            lugar: this.state.lugar
        }

        //guardamos en redux la última búsqueda desde la barra
        store.dispatch({
            type: 'SEARCH_BARRA',
            payload: filtroBusca
        });

        getOfertasFiltradas(this.state.puesto, this.state.lugar).catch(error =>console.error(error));
        
        this.props.history.push("/searchResults");

    }

    render() {
        
        return (
            <div className="busqueda">
                <div className="search">
                    <Input
                        placeholder="Dime que profesión estás buscando"
                        handleChange={this.handleChange}
                        value={this.state.puesto}
                        name="puesto"
                    />

                    <Input
                    
                        placeholder="¿En que ciudad?"
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
        //filtros: state.homeSearch?.filtros
    })
}


export default connect(mapStateToProps) (withRouter(Search));