import React, { Fragment } from "react";
import axios from "axios";
import { session, getUrl } from "../../utils/uti";
import queryString from "query-string";
import "./curriculum.scss";

class Curriculum extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            check1: false,
            check2: false,
            check3: false,
            formacion: "",
            experiencia: "",
            curriculumU: ""
        };
    }

    resetStates() {
        this.setState({
            check1: false,
            check2: false,
            check3: false,
            formacion: "",
            experiencia: "",
            curriculumU: ""
        });
    }

    updateDescriptionRemainingCharacters() {
        let ele = document.querySelector(".curriculum");

        if (!document.querySelector(".curriculum")) {
            ele = document.querySelector(".curriculum2");
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

    updateDescriptionRemainingCharacters2() {
        let ele = document.querySelector(".experiencia");

        if (!document.querySelector(".experiencia")) {
            ele = document.querySelector(".experiencia2");
        }

        let lenght = ele.value.length;
        let max = ele.maxLength;
        let remaining = document.querySelector("#descriptionRemainingCharacters2");

        remaining.innerHTML = `${lenght}/${max}`;

        if (lenght >= max) {
            remaining.classList.add("error");
        } else {
            remaining.classList.remove("error");
        }
    }

    async componentDidMount() {
        this.resetStates();

        const queries = queryString.parse(this.props.location.search);
        try {
            // let token = session.get()?.token;
            //let id = session.get()?.visitor_id;

            const res = await axios.get(getUrl(`/curriculum?idusuario=${queries.id}`));

            this.setState(
                {
                    curriculumU: res.data,
                    check1: res.data[0].isWorking ? true : false,
                    check2: res.data[0].isWorked_before ? true : false,
                    check3: res.data[0].isEstudios ? true : false,
                    formacion: res.data[0].formacion,
                    experiencia: res.data[0].experiencia
                },
                () => {
                    //console.log(this.state);
                }
            );
        } catch (err) {
            console.error(err);
        }
    }

    handleChange = ev => {
        this.setState({ [ev.target.name]: ev.target.type === "number" ? +ev.target.value : ev.target.value });

        // Excepción para medir caracteres restantes en la descripción
        if (ev.target.name === "formacion") {
            this.updateDescriptionRemainingCharacters("formacion");
        }

        if (ev.target.name === "experiencia") {
            this.updateDescriptionRemainingCharacters2("experiencia");
        }
    };

    handleChangeCheck = ev => {
        this.setState({ [ev.target.name]: ev.target.type === "number" ? +ev.target.checked : ev.target.checked }, () => {
            // this.buscaFiltro();
        });
    };

    showButton() {
        if (this.state.curriculumU[0]) {
            return (
                <Fragment>
                    <button
                        className="blueButton"
                        onClick={() => {
                            this.editaDatos();
                        }}
                    >
                        Editar
                    </button>
                </Fragment>
            );
        } else{
            return (
                <Fragment>
                    <button
                        className="blueButton"
                        onClick={() => {
                            this.registraDatos();
                        }}
                    >
                        Guardar
                    </button>
                </Fragment>
            );
        }
    }

    async editaDatos() {
        try {
            //let idusuario = session.get()?.visitor_id;

            
            let eBody = {
                id: this.state.curriculumU[0].id,
                formacion: this.state.formacion,
                experiencia: this.state.experiencia,
                isWorked_before: this.state.check2,
                isWorking: this.state.check1,
                isEstudios: this.state.check3
            };

            await axios.post(getUrl(`/modCurriculum`), eBody);
            
            let id_visitor = session.get()?.visitor_id;
            let profileName = session.get()?.visitor;
            //redirigimos
            setTimeout(() => {
                this.props.history.push(`/profileC?id=${id_visitor}&name=${profileName}`);
            }, 500);
        } catch (err) {
            console.log(err);
        }
    }

    async registraDatos() {
        try {
            let idusuario = session.get()?.visitor_id;

            //llamada a la DB para registrar el curriculum
            let lBody = {
                id: idusuario,
                formacion: this.state.formacion,
                experiencia: this.state.experiencia,
                isWorked_before: this.state.check2,
                isWorking: this.state.check1,
                isEstudios: this.state.check3
            };

            let res = await axios.post(getUrl(`/nuevoCurriculum`), lBody);
            //let data = res.data;
            console.log(res.data);
            let id_visitor = session.get()?.visitor_id;
            let profileName = session.get()?.visitor;
            //redirigimos
            setTimeout(() => {
                this.props.history.push(`/profileC?id=${id_visitor}&name=${profileName}`);
            }, 500);
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        return (
            <div className="curriculumContainer">
                <div className="cardQuest">
                    <div className="cuestionario">
                        <div className="checkBoxContainer ml5 mt5">
                            <label className="container">
                                ¿Estás trabajando actualmente?
                                <input type="checkbox" name="check1" checked={this.state.check1} value={this.state.check1} onChange={this.handleChangeCheck}></input>
                                <span className="checkmark"></span>
                            </label>
                        </div>
                        <div className="checkBoxContainer ml5 mt5">
                            <label className="container">
                                ¿Has trabajado anteriormente?
                                <input type="checkbox" name="check2" checked={this.state.check2} value={this.state.check2} onChange={this.handleChangeCheck}></input>
                                <span className="checkmark"></span>
                            </label>
                        </div>
                        <div className="checkBoxContainer ml5 mt5">
                            <label className="container">
                                ¿Tienes estudios oficiales?
                                <input type="checkbox" name="check3" checked={this.state.check3} value={this.state.check3} onChange={this.handleChangeCheck}></input>
                                <span className="checkmark"></span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="cardExp">
                    <div className="textAreaCurriculum">
                        <p className="cabeceraInput">Formacion</p>
                        <textarea
                            className="curriculum"
                            rows="5"
                            cols="108"
                            maxLength="2000"
                            placeholder="Utiliza este espacio para describir aquellos aspectos de tu formación que consideres de especial relevancia para las empresas."
                            name="formacion"
                            value={this.state.formacion}
                            onChange={this.handleChange}
                        ></textarea>
                        <span id="descriptionRemainingCharacters"></span>

                        <div className="textAreaCurriculum">
                            <p className="cabeceraInput">Experiencia laboral</p>
                            <textarea
                                className="experiencia"
                                rows="5"
                                cols="108"
                                maxLength="2000"
                                placeholder="Utiliza este espacio para describir tu trayectoria en el mundo laboral."
                                name="experiencia"
                                value={this.state.experiencia}
                                onChange={this.handleChange}
                            ></textarea>
                            <span id="descriptionRemainingCharacters2"></span>
                        </div>
                        <div className="containerButton mt5">{this.showButton()}</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Curriculum;
