import React from "react";
import Input from "../input/input";
import "./search.scss";
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
        //setstate de evento de búsqueda para setear las variables puesto y lugar según valor de input
        this.setState({[event.target.name]:event.target.value})
    }

    pulsaSearch() {

        //primero creamos un objeto con el contenido de las variables state de puesto y lugar
        let filtroBusca = {
            puesto: this.state.puesto,
            lugar: this.state.lugar
        }

        //guardamos en redux la última búsqueda desde la barra (el objeto filtroBusca), para disponer de ella
        store.dispatch({
            type: 'SEARCH_BARRA',
            payload: filtroBusca
        });


        //llamada a la función redux getOfertasFiltradas con los parámetros puesto y lugar (desde home)
        getOfertasFiltradas(this.state.puesto, this.state.lugar).catch(error =>console.error(error));
        
        //redirijimos a los resultados
        this.props.history.push("/searchResults");

        /*Function explain:
        
        1-Guardar los filtros desde home en un objeto(solo 2 posibles)

        2-Almacenar el objeto en el store de redux

        3-Función redux de búsqueda por filtros

        4-Redirección a searchResults
        
        */

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
    })
}


export default connect(mapStateToProps) (withRouter(Search));