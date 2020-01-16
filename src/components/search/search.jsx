import React from "react";
import Input from "../input/input";
import "./search.scss";

class Search extends React.Component {
    constructor (props) {
        super(props);
        this.state={
            ciudad:'',
            pueblo:''
        }
    };

    handleChange=(event)=> {
        // this.setState({[event.target.name]:event.target.value},()=> console.log(this.state))
        this.setState({[event.target.name]:event.target.value})
    }

    pulsaSearch=()=> {
        console.log("HAS PULSADO SI SEÑOR");
    }

    render() {
        return (
            <div className="busqueda">
                <div className="search">
                    {/* <input
                        type="text"
                        placeholder="Puesto, empresa, habilidad o palabra clave"
                        // onChange={ev => {
                        //     this.pulsaTecla(ev);
                        // }}
                    />

                    <input
                        type="text"
                        placeholder="Ciudad, provincia o país"
                        // onChange={ev => {
                        //     this.pulsaTecla(ev);
                        // }}
                    /> */}

                    <Input
                        placeholder="Puesto, empresa, habilidad o palabra clave"
                        handleChange={this.handleChange}
                        value={this.state.ciudad}
                        name="ciudad"
                    />

                    <Input
                    
                        placeholder="Ciudad, provincia o país"
                        handleChange={this.handleChange}
                        value={this.state.pueblo}
                        name="pueblo"
                    
                    />

                    <div className="backgroundIcon">
                        {/* <i className="material-icons" onClick={() => this.pulsaBotonBusqueda()}>
                            search
                        </i> */}
                        {/* <button className="logoutButton" onClick={() => this.pulsaLogout()}>
                                Logout
                            </button> */}
                    </div>
                    
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

export default Search;
