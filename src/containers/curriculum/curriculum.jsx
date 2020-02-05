import React from "react";
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
            experiencia: ""
        }

    };

    resetStates() {
        this.setState({
            check1: false,
            check2: false,
            check3: false,
            formacion: "",
            experiencia: ""
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
            let id = session.get()?.visitor_id;

            const res = await axios.get(getUrl(`/curriculum/${queries.id}`));
            
            this.setState({ 

                check1: res.data[id].isWorking,
                check2: res.data[id].isWorked_before,
                check3: res.data[id].isEstudios,
                formacion: res.data[id].formacion,
                experiencia: res.data[id].experiencia
            
            });
        } catch (err) {
            console.error(err);
        }

        // let id_visitor = session.get()?.visitor_id;
        // let profileName = session.get()?.visitor;
        // this.props.history.push(`/profileC?id=${id_visitor}&name=${profileName}`);
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
        this.setState({ [ev.target.name]: ev.target.type === "number" ? +ev.target.checked : ev.target.checked },() => {

            // this.buscaFiltro();
        });

    };


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
                {/* Aqui se mostrará el curriculum ...nice as it can be. */}
                <div className="cardQuest">
                    <div className="cuestionario">
                        <div className="checkBoxContainer ml5 mt5">
                            <label className="container">
                            ¿Estás trabajando actualmente?
                            <input type="checkbox" name="check1" value={this.state.check1} onChange={this.handleChangeCheck}></input>
                            <span className="checkmark"></span>
                            </label>
                        </div>
                        <div className="checkBoxContainer ml5 mt5">
                            <label className="container">
                            ¿Has trabajado anteriormente?
                            <input type="checkbox" name="check2" value={this.state.check2} onChange={this.handleChangeCheck}></input>
                            <span className="checkmark"></span>
                            </label>
                        </div>
                        <div className="checkBoxContainer ml5 mt5">
                            <label className="container">
                            ¿Tienes estudios oficiales?
                            <input type="checkbox" name="check3" value={this.state.check3} onChange={this.handleChangeCheck}></input>
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
                        <div className="containerButton mt5">
                            <button className="blueButton" onClick={() => {
                                this.registraDatos();
                            }}>Guardar</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };


};


export default Curriculum;