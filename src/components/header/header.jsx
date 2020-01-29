import React, { Fragment } from "react";
import { NavLink, withRouter } from "react-router-dom";
// import axios from "axios";
import { connect } from "react-redux";
// import { session, getUrl } from "../../utils/uti";
import { session } from "../../utils/uti";
// import { login } from "../../redux/actions/users";
import Menunav from "../../components/menuNav/menuNav";
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
        //const visitor = session.get()?.visitor;

        //const isLoggedIn = session.get()?.logged;

        if (this.props.isLoggedIn && userType) {
            // si estoy logeado...

            switch (userType) {
                case "Candidato":
                    //en el caso de que sea usuario
                    return (
                        <Fragment>
                            <div className="menuHeader mr5">
                                {/* <a>{visitor}</a> */}
                                <Menunav />
                            </div>
                        </Fragment>
                    );

                case "Empresa":
                    //en el caso de que sea empresa
                    return (
                        <Fragment>
                            <div className="menuHeader mr5">
                                {/* <a>{visitor}</a> */}
                                <Menunav />
                            </div>
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
        isLoggedIn: state.isLoggedIn
    };
};

export default connect(mapStateToProps)(withRouter(Header));
