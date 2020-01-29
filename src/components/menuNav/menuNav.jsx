import React, { Fragment } from "react";
import { session, getUrl } from "../../utils/uti";
import axios from "axios";
import { login } from "../../redux/actions/users";
import { NavLink, withRouter } from "react-router-dom";

import "./menuNav.scss";

class Menunav extends React.Component {

    async pulsaLogout() {
        // let token = session.get().token;
        let id = session.get()?.visitor_id;
        let userType = session.get()?.userType;
        let lBody = {
            id: id,
        }

        // Hago la llamada para borrar mi token
        try {

            if(userType === "Candidato"){
                let res = await axios.post(getUrl(`/logOutU`),lBody);
            }else{
                let res = await axios.post(getUrl(`/logOutE`),lBody);
            }

        } catch (err) {
            console.log(err);
        }

        // Borro mis datos de sesión (IMPORTANTISIMO!!!)
        session.del();

        //rdx no logeado
        login(false);

        // Redirección
        this.props.history.push("/");
    }

    redirect(arg){
        // Redirección
        this.props.history.push(`/${arg}`);
    }

    showMenuNav() {
        let userType = session.get()?.userType;
        let profileName = session.get()?.visitor;
        let id_visitor = session.get()?.visitor_id;
        switch (userType) {
            case "Candidato":
                return (
                    <div className="dropMenu">
                        <img src="img/profileIcon.png" alt="logo" />
                        <ul className="dd-list">
                            <li className="dd-list-item-head">{profileName}</li>
                            <li onClick={() => {this.redirect(`profileC?id=${id_visitor}&name=${profileName}`)}} className="dd-list-item">Perfil</li>
                            <li onClick={() => {this.redirect(`curriculum?id=${id_visitor}&name=${profileName}`)}} className="dd-list-item">Currículum</li>
                            <li onClick={() => {this.redirect("candidaturas")}} className="dd-list-item">Candidaturas</li>
                            <li onClick={() => {this.pulsaLogout()}} className="dd-list-item">Log out</li>
                        </ul>
                    </div>
                );

            case "Empresa":
                return (
                    <div className="dropMenu">
                        <img src="img/profileIcon.png" alt="logo" />
                        <ul className="dd-list2">
                            <li className="dd-list-item-head">{profileName}</li>
                            <li onClick={() => {this.redirect(`profileE?id=${id_visitor}&name=${profileName}`)}} className="dd-list-item2">Perfil</li>
                            <li onClick={() => {this.redirect("ofertas")}} className="dd-list-item2">Ofertas</li>
                            {/* <li onClick={() => {this.redirect("candidaturas")}} className="dd-list-item">Candidaturas</li> */}
                            <li onClick={() => {this.pulsaLogout()}} className="dd-list-item2">Log out</li>
                        </ul>
                    </div>
                );
        }
    }

    render() {
        return <Fragment>{this.showMenuNav()}</Fragment>;
    }
}

// export default Menunav;
export default withRouter(Menunav);
