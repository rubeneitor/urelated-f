import React, { Fragment } from "react";
import { NavLink, withRouter } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";
import { session, getUrl } from "../../utils/uti";
import { login } from "../../redux/actions/users";
import "./header.scss";

class Header extends React.Component {
    constructor(props) {
        super(props);

        // this.state = {
        //     keywords: "",
        //     debounce_timeout: null
        // };
    }

    BotonesHeader() {
        
        const userType = session.get()?.userType;
        console.log(userType);
        console.log(this.props.isLoggedIn);
        
        //const isLoggedIn = session.get()?.logged;

        if (this.props.isLoggedIn && userType) {
            // si estoy logeado...

            switch (userType) {
                case "Candidato":
                    //en el caso de que sea usuario
                    return (
                        <Fragment>
                            <button>
                                <NavLink exact to="/loginE">
                                    Perfil
                                </NavLink>
                            </button>
                            <button>
                                <NavLink exact to="/loginC">
                                    CV
                                </NavLink>
                            </button>
                            <button>
                                <NavLink exact to="/loginC">
                                    Candidaturas activas
                                </NavLink>
                            </button>

                            <button className="logoutButton" onClick={() => this.pulsaLogout()}>
                                Logout
                            </button>
                        </Fragment>
                    );

                case "Empresa":
                    //en el caso de que sea empresa
                    return (
                        <Fragment>
                            <button>
                                <NavLink exact to="/loginE">
                                    Perfil
                                </NavLink>
                            </button>
                            <button>
                                <NavLink exact to="/loginC">
                                    Proceso de seleccion
                                </NavLink>
                            </button>
                            <button>
                                <NavLink exact to="/loginC">
                                    Publicar ofertas
                                </NavLink>
                            </button>

                            <button className="logoutButton" onClick={() => this.pulsaLogout()}>
                                Logout
                            </button>
                        </Fragment>
                    );

                default:
                    console.log("USERTYPE ERROR - not candidate, not business");
            }
        } else {
            //visito la página de forma anónima..

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

    pulsaLogout() {
        let token = session.get().token;
        console.log(token);
        // Hago la llamada para borrar mi token
        //axios.get(getUrl(`/user/logout?token=${token}`));

        // Borro mis datos de sesión (IMPORTANTISIMO!!!)
        session.del();

        //rdx no logeado
        login(false);

        // Redirección
        this.props.history.push("/");
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
        isLoggedIn: state.isLoggedIn, 
        
    };
};

export default connect(mapStateToProps)(withRouter(Header));


