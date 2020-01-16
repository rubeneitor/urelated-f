import React, { Component } from "react";
import { listaCategorias } from "../../utils/uti";
import "./home.scss";

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            detail: {},
            categoriaSugerida: ""
        };
    }

    UNSAFE_componentWillMount() {
        //Comprobamos si hay una categoría guardada en el localStorage.

        if (localStorage.getItem("categoriaBuscada")) {
            this.setState({ categoriaSugerida: localStorage.getItem("categoriaBuscada") });
        } else {
            //En caso de no haberla, asignamos una categoría random.

            let arrCategorias = Object.keys(listaCategorias);

            let lengthObj = Object.keys(listaCategorias).length;

            let numRand = Math.floor(Math.random() * (lengthObj + 1 - 0) + 0);

            this.setState({ categoriaSugerida: arrCategorias[numRand] });
        }
    }

    render() {
        return (
            <div className="home">
                <div className="mainHome">
                    <div className="busquedaOfertas">ofertas</div>
                    <div className="userRegisterHome">registro user</div>
                    <div className="empresaRegisterHome">registro empresa</div>
                    <div className="motivationalHome">"life coding on PHP is sooooooooo wonderful"</div>
                    <div className="blankHome"></div>
                </div>
            </div>
			
        );
    }
}

export default Home;
