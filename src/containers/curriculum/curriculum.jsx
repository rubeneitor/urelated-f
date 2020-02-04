import React from "react";
import axios from "axios";
import { session, getUrl, verify } from "../../utils/uti";
import queryString from "query-string";
import "./curriculum.scss";


class Curriculum extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isWorked_before: false,
            isWorking: false,
            isEstudios: false,
            formacion: "",
            requisitos: ""
        }

    };

    resetStates() {
        this.setState({
            isWorking: false,
            isWorked_before: false,
            isEstudios: false,
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

                isWorking: res.data[id].isWorking,
                isWorked_before: res.data[id].isWorked_before,
                isEstudios: res.data[id].isEstudios,
                formacion: res.data[id].formacion,
                experiencia: res.data[id].experiencia
            
            });
        } catch (err) {
            console.error(err);
        }

        let id_visitor = session.get()?.visitor_id;
        let profileName = session.get()?.visitor;
        this.props.history.push(`/profileC?id=${id_visitor}&name=${profileName}`);
    }

    handleChange = ev => {
        this.setState({ [ev.target.name]: ev.target.type === "number" ? +ev.target.value : ev.target.value });
    };


    async registraDatos() {
        try {

            let id = session.get()?.visitor_id;
            console.log(id);
            //llamada a la DB para registrar la empresa
            let lBody = {
                id: id,
                formacion: this.state.formacion,
                requisitos: this.state.requisitos,
                isWorked_before: this.state.isWorked,
                isWorking: this.state.isWorking,
                isEstudios: this.state.isEstudios
            };

            console.log(lBody);

            let res = await axios.post(getUrl(`/nuevoCurriculum`), lBody);
            let data = res.data;

            //redirigimos
            setTimeout(() => {
                this.props.history.push("/profileC");
            }, 500);
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        return (
            <div className="curriculumContainer">
                {/* Aqui se mostrará el curriculum ...nice as it can be. */}
                <div className="cartQuest">
                    <div className="questionario">
                        <div>
                            <p className="titulos">¿Estas trabajando actualmente?</p>
                            <input type="radio" id="si" name="isWorking" value={this.state.isWorking}
                                onChange={this.handleChange} />
                            <label>Si</label>
                            <input type="radio" id="no" name="isWorking" value="no"
                                onChange={this.handleChange} />
                            <label>No</label>
                        </div>
                        <div>
                            <p className="titulos">¿Has trabajado anteriormente?</p>
                            <input type="radio" id="si" name="isWorked-before" value={this.state.isWorked}
                                onChange={this.handleChange} />
                            <label>Si</label>
                            <input type="radio" id="no" name="isWorked-before" value={this.state.isWorked}
                                onChange={this.handleChange} />
                            <label>No</label>
                        </div>
                        <div>
                            <p className="titulos">¿Tienes estudios?</p>
                            <input type="radio" id="si" name="isEstudios" value={this.state.isEstudios}
                                onChange={this.handleChange} />
                            <label>Si</label>
                            <input type="radio" id="no" name="isEstudios" value={this.state.isEstudios}
                                onChange={this.handleChange} />
                            <label>No</label>
                        </div>
                    </div>

                </div>
                <div className="cartExp">
                    <div className="expProfForm">
                        <div>
                            <p className="titulos">Experiencia profesional:</p>
                            <textarea cols="100" rows="7" onChange={this.handleChange}></textarea>
                        </div>
                        <div>
                            <p className="titulos">Formacion:</p>
                            <textarea cols="100" rows="7" onChange={this.handleChange}></textarea>
                        </div>
                        <div className="containerButton">
                            <button className="colorButton" onClick={() => {
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