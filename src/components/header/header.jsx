
import React, { Fragment } from "react";
import { NavLink, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { session } from "../../utils/uti";
import Menunav from "../../components/menuNav/menuNav";
import "./header.scss";

class Header extends React.Component {
    // constructor(props) {
    //     super(props);

    // }

    BotonesHeader() {

        //funcion encargada de mostar las zonas interactivas del header que nos conducirán entre secciones

        //primero obtenemos el userType (empresa / candidato)
        const userType = session.get()?.userType;

        if (this.props.isLoggedIn && userType) {
            // si estoy logeado...

            switch (userType) {
                case "Candidato":
                    //en el caso de que sea usuario
                    return (
                        <Fragment>
                            <div className="menuHeader mr5">
                                {/* Carga del componente menuNav (tooltip a secciones de candidato) */}
                                <Menunav />
                            </div>
                        </Fragment>
                    );

                case "Empresa":
                    //en el caso de que sea empresa
                    return (
                        <Fragment>
                            <div className="menuHeader mr5">
                                {/* Carga del componente menuNav (tooltip a secciones de empresa) */}

                                <Menunav />
                            </div>
                        </Fragment>
                    );

                default:
                    console.log("USERTYPE ERROR - not candidate, not business");
            }
        } else {
            
            //visito la página de forma anónima.. links a login/registro tanto de candidato como de empresa
            return (
                <Fragment>
                    <button>
                        <NavLink exact to="/loginE">
                            Acceso empresas
                        </NavLink>
                    </button>
                    <button>
                        <NavLink exact to="/loginC">
                            Acceso candidatos
                        </NavLink>
                    </button>
                </Fragment>
            );
        }
    }

    render() {
        return (
            <Fragment>
                <header>
                    <div className="logo ml5 mt1">
                        <NavLink to="/">
                            <img src="img/logouRelated_1lit.png" alt="logo" />
                        </NavLink>
                    </div>
                    <div className="slogan ml3">_Hiring Time</div>

                    <div className="nav">{this.BotonesHeader()}</div>
                </header>
                {/* <Search /> */}
            </Fragment>
        );
    }
}

const mapStateToProps = state => {
    // ese state es de redux
    return {
        //recogemos la variable rdx isLoggedIn para saber si está logeado o no
        isLoggedIn: state.isLoggedIn
    };
};

export default connect(mapStateToProps)(withRouter(Header));
