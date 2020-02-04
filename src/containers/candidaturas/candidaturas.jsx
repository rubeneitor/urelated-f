
import React, { Fragment } from "react";
import { session, getUrl} from "../../utils/uti";
import axios from "axios";
import queryString from 'query-string';
import "./candidaturas.scss";


class Candidaturas extends React.Component {
    
    constructor (props) {
        super(props);
        
        this.state = {
            userType : session.get()?.userType,
            ofertasEmpresaInfo : "",
        }
    };

    async componentDidMount(){
        
        //comprobamos si se trata de una empresa o un candidato
        if(this.state.userType === "Empresa"){

            //buscamos las candidaturas por empresa
            //obtenemos la id de oferta
            const queries = queryString.parse(this.props.location.search);

            //axios...
            const res = await axios.get(getUrl(`/suscripcionesPorE?id_oferta=${queries.idoferta}`));

            this.setState({ofertasEmpresaInfo : res.data});

            // console.log(this.state.ofertasEmpresaInfo);

        }else{
            //buscamos las candidaturas por candidato
            const id_usuario = session.get()?.visitor_id;

            //axios...
            const res = await axios.get(getUrl(`/suscripcionesPorU?id_usuario=${id_usuario}`));
            
            console.log(res);
        }

    }

    clickVolver(){
        this.props.history.push(`/ofertas`);
    }

    muestraResultadoE () {
        console.log(this.state.ofertasEmpresaInfo[0]);
        if(!this.state.ofertasEmpresaInfo){
            return (
            <Fragment>
                <div>
                    <div className="main">
                        <div className="mainCandidaturasEmpresa">
                            <div className="noCandidaturas">
                                <p className="sinCandidatos">Vaya, aun no hay candidatos inscritos a esta oferta.</p>
                                <button onClick={()=>{this.clickVolver()}} className="blueButton mt5">Volver</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
            );

        }else{
            return(

                <Fragment>
                <div>
                    <div className="main">
                        <div className="mainCandidaturasEmpresa">
                            <div className="columnOfertaInfo mt5">
                                <div className="ofertaIContenedor mt5 ml5">
                                <p className="tituloInfo mr3">Puesto:</p>
                                <p className="infoOferta ">{this.state.ofertasEmpresaInfo[0].titulo}</p>
                                </div>
                                <div className="ofertaIContenedor mt5 ml5">
                                <p className="tituloInfo mr3">Publicación:</p>
                                <p className="infoOferta ">{this.state.ofertasEmpresaInfo[0].fecha_publi}</p>
                                </div>
                                <div className="ofertaIContenedor mt5 ml5">
                                <p className="tituloInfo mr3">Ciudad:</p>
                                <p className="infoOferta ">{this.state.ofertasEmpresaInfo[0].ciudad}</p>
                                </div>
                                <div className="ofertaIContenedor mt5 ml5">
                                <p className="tituloInfo mr3">Sector:</p>
                                <p className="infoOferta ">{this.state.ofertasEmpresaInfo[0].sector}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </Fragment>

            );
        }

        
    }
    
    render() {
        
        if(this.state.userType === "Empresa"){
            return (
                <Fragment>
                    
                    {this.muestraResultadoE()}

                </Fragment>
            );
        }
        
    };
};


export default Candidaturas;