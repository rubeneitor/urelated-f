import React, { Fragment } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { session, getUrl, verify } from "../../utils/uti";
import "./profileE.scss";

class ProfileE extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userData: [],
            button: "blueButton",
            readOnly: true
        };
    }

    resetStates() {
        this.setState({ userData: "" });
        this.setState({ button: "blueButton" });
    }

    handleChange = ev => {
        this.setState({ [ev.target.name]: ev.target.type === "number" ? +ev.target.value : ev.target.value });

        // Excepción para medir caracteres restantes en la descripción
        if (ev.target.name === "description") {
            this.updateDescriptionRemainingCharacters();
        }
    };

    updateDescriptionRemainingCharacters() {
        let ele = document.querySelector(".textAddInfo");

        if (!document.querySelector(".textAddInfo")) {
            ele = document.querySelector(".textAddInfo2");
        }

        let lenght = ele.value.length;
        let max = ele.maxLength;
        let remaining = document.querySelector("#descriptionRemainingCharacters");

        remaining.innerHTML = `${lenght}/${max}`;

        if (lenght >= max) {
            remaining.classList.add("error");
        } else {
            remaining.classList.remove("error");
        }
    }

    async componentDidMount() {
        try {
            let token = session.get()?.token;
            let id = session.get()?.visitor_id;

            //const res = await axios.get(getUrl(`/user/${id}?token=${token}`));

            //this.setState({ userData: res.data });
        } catch (err) {
            console.error(err);
        }
    }

    clickEditar() {
        //estilo del boton ... aviso (boton rojo) y edicion habilitada
        if (this.state.button === "blueButton") {
            this.setState({ button: "redButton" });
            this.setState({ readOnly: false });
        } else {
        }
    }

    render() {
        return (
            <div className="main">
                <div className="mainProfileE">
                    <div className="cardProfile">
                        <div className="cardHeader">
                            <p className="profileText">Datos de la entidad.</p>
                        </div>
                        <div className="line"></div>
                        <div className="profileInfo">
                            <div className="profileInfoGrid">
                                <div className="mt5">
                                    <p className="cabeceraInput ml3">Nombre</p>
                                    <input className="inputProfile ml3" readOnly={this.state.readOnly} placeholder="bangolufsen"></input>
                                </div>
                                <div className="mt5">
                                    <p className="cabeceraInput">E-mail</p>
                                    <input className="inputProfile" readOnly={this.state.readOnly} placeholder="bangolufsen@gmail.com"></input>
                                </div>
                                <div className="mt5">
                                    <p className="cabeceraInput ml3">Teléfono</p>
                                    <input className="inputProfile ml3" readOnly={this.state.readOnly} placeholder="963753421"></input>
                                </div>
                                <div>
                                    <p className="cabeceraInput">Sector</p>
                                    <input className="inputProfile" readOnly={this.state.readOnly} placeholder="Software"></input>
                                </div>
                            </div>
                            <div className="descripcionEmpresa mr5">
                                <p className="cabeceraInput">Descripcion de tu empresa</p>
                                <textarea
                                    // className={this.errorCheck("description")}
                                    className="textAddInfo"
                                    readOnly={this.state.readOnly}
                                    rows="7"
                                    cols="50"
                                    maxLength="2000"
                                    placeholder="Utiliza este espacio para describir a tu empresa tal y como quieres que se muestre
                                    a los candidatos. Sugerencia: Puedes utilizar la descripción de tu web corporativa."
                                    name="description"
                                    value={this.state.description}
                                    onChange={this.handleChange}
                                ></textarea>
                                <span id="descriptionRemainingCharacters"></span>
                            </div>
                        </div>
                    </div>
                    <div className="cardEditProfile ml5">
                        <div className="cardEditProfileHeader">
                            <img src="https://www.bang-olufsen.com/~/media/images/bang-olufsen-attention-logo.png" alt="logoEmpresa" />
                        </div>
                        <div className="cardEditProfileBody mt3">
                            <div className="editInfoRight">
                                {/* <p>{this.state.userData?.name}</p>
                                <p className="mt1">{this.state.userData?.updated_at}</p> */}
                                <p className="nameMod mt3">Bang Olufsen</p>
                                <p className="dateMod mt3">27/01/2020</p>
                                <p className="dateMod2">Última fecha de modificación.</p>
                                <button
                                    className={this.state.button}
                                    onClick={() => {
                                        this.clickEditar();
                                    }}
                                >
                                    Editar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ProfileE;
