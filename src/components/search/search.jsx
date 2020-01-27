import React from "react";
import Input from "../input/input";
import axios from "axios";
import { getUrl } from "../../utils/uti";
import "./search.scss";
import { rdx_ofertasResultado } from "../../redux/actions/ofertas";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

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

    async pulsaSearch() {
        
        let res = {};
        
        
        //primero concertamos sobre cuantos campos se ha buscado
        
        //ninguno 
        if(this.state.puesto === "" && this.state.lugar === ""){
            try {
                res = await axios.get(getUrl(`/allOfertas`));
            } catch (err) {
                res = "error";
            }
        }

        //palabra clave
        if(this.state.puesto !== "" && this.state.lugar === ""){
            
            try {
                res = await axios.get(getUrl(`/ofertasOk/${this.state.puesto}`));
            } catch (err) {
                res = "error";
            }
        }
        
        //lugar
        if(this.state.puesto === "" && this.state.lugar !== ""){
            
            try {
                res = await axios.get(getUrl(`/zonas/${this.state.lugar}`));
            } catch (err) {
                res = "error";
            }
        }

        //ambos
        if(this.state.puesto !== "" && this.state.lugar !== ""){
            
            try {
                res = await axios.get(getUrl(`/busquedaFiltro/${this.state.puesto}/${this.state.lugar}`));
            } catch (err) {
                res = "error";
            }
            
        }
        

        //guardamos los resultados en redux
        rdx_ofertasResultado({
			data: res.data
        });

        this.setState({puesto: ''});
        this.setState({lugar: ''});

        //redireccion con los resultados
        this.props.history.push("/searchResults");
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
		ofertasResultado: state.ofertasResultado
    })
}


export default connect(mapStateToProps) (withRouter(Search));