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
            requisitos: ""
        }

    };

    resetStates() {
        this.setState({
            check1: false,
            check2: false,
            check3: false,
            formacion: "",
            requisitos: ""
        });
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
                requisitos: this.state.requisitos,
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
                    <div className="expProfForm">
                        <div>
                            <p className="titulos">Experiencia profesional:</p>
                            <textarea cols="100" rows="7" onChange={this.handleChange}></textarea>
                        </div>
                        <div className="mt3">
                            <p className="titulos">Formacion:</p>
                            <textarea cols="100" rows="7" onChange={this.handleChange}></textarea>
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