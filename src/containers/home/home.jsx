import React, { Component, Fragment } from "react";
import { getUrl } from "../../utils/uti";
import axios from "axios";
import { rdx_ofertasResultado } from "../../redux/actions/ofertas";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Search from "../../components/search/search";
import "./home.scss";

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            detail: {},
        };
    }

    pulsaRegUser() {
        this.props.history.push("/registerC");
    }

    pulsaRegEmpresa() {
        this.props.history.push("/registerE");
    }

    async pulsaImagen(argImg) {
        let res = {};
        //aqui recibiremos y haremos el axios
        try {
            res = await axios.get(getUrl(argImg));
        } catch (err) {
            res = "error";
        }
        
        //guardamos los resultados en redux
        rdx_ofertasResultado({
			data: res.data
        });

        //redireccion con los resultados
        this.props.history.push("/searchResults");
        
    }

    render() {
        return (
            <Fragment>
                <Search />
                <div className="home">
                    <div className="mainHome">
                        <div className="busquedaOfertas">
                            <div className="bloqueSelectHome">
                                <img
                                    onClick={() => {
                                        this.pulsaImagen(`/salarios/${"24000"}`);
                                    }}
                                    className="imgHomeSelect"
                                    src="img/salary.png"
                                    alt="salary"
                                />
                                <p className="textImageHome">24.000€ o Superior</p>
                            </div>
                            <div className="bloqueSelectHome">
                                <img
                                    onClick={() => {
                                        this.pulsaImagen(`/puestos/${"CEO"}`);
                                    }}
                                    className="imgHomeSelect"
                                    src="img/ceo.png"
                                    alt="ceo"
                                />
                                <p className="textImageHome">CEO/Directivo</p>
                            </div>
                            <div className="bloqueSelectHome">
                                <img
                                    onClick={() => {
                                        this.pulsaImagen(`/contratos/${"teletrabajo"}`);
                                    }}
                                    className="imgHomeSelect"
                                    src="img/homeWork.png"
                                    alt="homework"
                                />
                                <p className="textImageHome">Teletrabajo</p>
                            </div>
                            <div className="bloqueSelectHome">
                                <img
                                    onClick={() => {
                                        this.pulsaImagen(`/ciudades/${"Valencia"}`);
                                    }}
                                    className="imgHomeSelect"
                                    src="img/vlnc.png"
                                    alt="vlnc"
                                />
                                <p className="textImageHome">Valencia</p>
                            </div>
                            <div className="bloqueSelectHome">
                                <img
                                    onClick={() => {
                                        this.pulsaImagen(`/sectores/${"software"}`);
                                    }}
                                    className="imgHomeSelect"
                                    src="img/coder.png"
                                    alt="coder"
                                />
                                <p className="textImageHome">Software</p>
                            </div>
                        </div>
                        <div className="userRegisterHome">
                            <div className="userRegisterContent">
                                <div className="puzzleContainer">
                                    <img className="puzzle" src="img/jigsaw.png" alt="jigsaw" />
                                </div>
                                <div className="userTextRegistro">
                                    <p className="userRegisterTextOne">DALE FORMA A TU FUTURO</p>
                                    <p className="userRegisterTextTwo mt1">Regístate en uRelated y encuentra las piezas que necesitas.</p>
                                    <div className="iconsHomeReg mt5">
                                        <div className="iconBlock">
                                            <img className="iconH" src="img/sheet2.png" alt="sheet" />
                                            <p className="mt1">Currículum</p>
                                        </div>
                                        <div className="iconBlock">
                                            <img className="iconH" src="img/resumeSearch.png" alt="resume" />    
                                            <p className="mt1">Búsquedas</p>
                                        </div>
                                        <div className="iconBlock">
                                            <img className="iconH" src="img/checkIcon.png" alt="check" />
                                            <p className="mt1">Ofertas</p>
                                        </div>
                                        <div className="iconBlock">
                                            <img className="iconH" src="img/socialIcon.png" alt="social" />
                                            <p className="mt1">Social</p>
                                        </div>
                                    </div>
                                    <button className="botonRegistroUsuarios">
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
                                    <p className="empresaTextRegistroTwo mt3">Registra tu empresa y publica ofertas de empleo de forma rápida y segura.</p>
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

const mapStateToProps = (state) => { // ese state es de redux
	return ({
		ofertasResultado: state.ofertasResultado
    })
}


export default connect(mapStateToProps) (withRouter(Home));