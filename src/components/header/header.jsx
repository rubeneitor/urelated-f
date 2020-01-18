import React, { Fragment } from "react";
import { NavLink, withRouter } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";

import { session, getUrl } from "../../utils/uti";
import { login } from "../../redux/actions/users";
import { rdx_productSearchResults } from "../../redux/actions/products";
// import Search from "../search/search";

import "./header.scss";

class Header extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            keywords: "",
            debounce_timeout: null
        };
    }

    BotonesHeader() {
        // let nCesta = this.props.cart ? Object.keys(this.props.cart).length : 0;
        // let strNCesta = nCesta === 0 ? "" : `(${nCesta})`;

        const userType = session.get()?.userType;

        if (this.props.isLoggedIn && userType) {
            // si estoy logeado...

            switch (userType) {
                case 1:
                    //en el caso de que sea usuario

                    return (
                        <Fragment>
                            <button>
                                <NavLink exact to="/profile">
                                    Perfil
                                </NavLink>
                            </button>

                            <button className="logoutButton" onClick={() => this.pulsaLogout()}>
                                Logout
                            </button>
                        </Fragment>
                    );

                case 2:
                    //en el caso de que sea empresa
                    return (
                        <Fragment>
                            <button>
                                <NavLink exact to="/profile">
                                    Perfil
                                </NavLink>
                            </button>
                            <button>
                                <NavLink exact to="/storage">
                                    Mi inventario
                                </NavLink>
                            </button>

                            <button className="logoutButton" onClick={() => this.pulsaLogout()}>
                                Logout
                            </button>
                        </Fragment>
                    );

                case 3:
                    return (
                        <Fragment>
                            <button>
                                <NavLink exact to="/admin">
                                    Admin
                                </NavLink>
                            </button>
                            <button>
                                <NavLink exact to="/profile">
                                    Perfil
                                </NavLink>
                            </button>
                            <button>
                                <NavLink exact to="/storage">
                                    Mi inventario
                                </NavLink>
                            </button>

                            <button className="logoutButton" onClick={() => this.pulsaLogout()}>
                                Logout
                            </button>
                        </Fragment>
                    );

                default:
                    console.log("USERTYPE ERROR - not buyer, not seller, not admin");
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

    buscaResultados() {
        let keywords = this.state.keywords;
        let query = keywords !== "" ? `?title=${keywords}` : "";

        axios
            .get(getUrl(`/product/get${query}`))
            .then(res => {
                // Envio a redux
                rdx_productSearchResults({
                    keywords: keywords,
                    data: res.data
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    debounce() {
        // Si ya estoy en un timeout, salgo y cancelo
        if (this.state.debounce_timeout) {
            clearTimeout(this.state.debounce_timeout); // quito el loop
            this.setState({ debounce_timeout: null }); // y su referencia
        }

        // Empiezo un timeout
        const loop = setTimeout(() => {
            this.buscaResultados();
        }, 500);

        // Guardo la referencia de timeout
        this.setState({ debounce_timeout: loop });
    }

    pulsaTecla(ev) {
        let busqueda = ev.target.value;
        busqueda = busqueda.trim();

        if (busqueda === "") {
            this.props.history.push("/");
        } else {
            // Guardo resultados
            this.setState({ keywords: busqueda });

            // Busco resultados
            this.debounce();

            // Redirijo
            this.props.history.push("/search");
        }
    }

    // pulsaBotonBusqueda() {

    // 	// Guardo resultados
    // 	this.setState({ keywords: "" });

    // 	// Busco resultados
    // 	this.debounce();

    // 	// Redirijo
    // 	this.props.history.push("/search");

    // };

    pulsaLogout() {
        let token = session.get().token;

        // Hago la llamada para borrar mi token
        axios.get(getUrl(`/user/logout?token=${token}`));

        // Borro mis datos de sesión
        session.del();

        // Digo que no estoy logeado (con redux)
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
        isLoggedIn: state.isLoggedIn, //creamos la prop user a partir de la key user del state
        cart: state.cart
    };
};

export default connect(mapStateToProps)(withRouter(Header));

// withRouter(Header) es para meter Header en el contexto de "Route" para que tenga el history y toa la movida
