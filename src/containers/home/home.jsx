import React, { Component, Fragment } from "react";

import { listaCategorias } from "../../utils/uti";
import Search from "../../components/search/search";
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

    pulsaRegUser() {
        this.props.history.push("/registerC");
    }

    pulsaRegEmpresa() {
        this.props.history.push("/registerE");
    }

    render() {
        return (
            <Fragment>
                <Search />
                <div className="home">
                    <div className="mainHome">
                        <div className="busquedaOfertas">ofertas</div>
                        <div className="userRegisterHome">
                            <div className="userRegisterContent">
                                <div className="puzzleContainer">
                                    <img className="puzzle" src="img/jigsaw.png" alt="jigsaw" />
                                </div>
                                <div className="userTextRegistro">
                                    <p className="userRegisterTextOne">DALE FORMA A TU FUTURO</p>
                                    <p className="userRegisterTextTwo mt1">Regístate en uRelated y encuentra las piezas que necesitas.</p>
                                    <button className="botonRegistroUsuarios mt5">
                                        <p className="textoBoton" onClick={() => this.pulsaRegUser()}>
                                            Regístrate
                                        </p>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="empresaRegisterHome">
                            <div className="empresaRegisterContent">
                                <div className="businessContainer">
                                    <img className="business" src="img/business.png" alt="business" />
                                </div>
                                <div className="empresaTextRegistro">
                                    <p className="empresaTextRegistroOne">No dejes escapar el talento.</p>
                                    <p className="empresaTextRegistroTwo mt3">Registra tu empresa y publica
                                    ofertas de empleo de forma rápida y segura.</p>
                                    <button className="botonRegistroEmpresas mt5">
                                        <p className="textoBoton" onClick={() => this.pulsaRegEmpresa()}>
                                            Da de alta tu empresa
                                        </p>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="motivationalHome ">
                            <div className="motivationalContent">
                                <p className="motivationalText">"Sólo existen dos dias al año en los que no se puede hacer nada, ayer y mañana."</p>
                                <p className="motivationalTextDos">Bienvenido a uRelated, la working community donde miles de usuarios, empresas y blablabla te esperan.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default Home;
