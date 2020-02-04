
import React from "react";
import { session, getUrl} from "../../utils/uti";
import axios from "axios";
import queryString from 'query-string';
import "./candidaturas.scss";


class Candidaturas extends React.Component {
    
    constructor (props) {
        super(props);
        
        this.state = {
            userType : session.get()?.userType,
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

            console.log(res);

        }else{
            //buscamos las candidaturas por candidato
            const id_usuario = session.get()?.visitor_id;

            //axios...
            const res = await axios.get(getUrl(`/suscripcionesPorU?id_usuario=${id_usuario}`));
            
            console.log(res);
        }

    }
    
    render() {
        return(
            <div>
                Las candidaturas y su estado se mostrarán aqui.
            </div>
        );
    };
    
    
};


export default Candidaturas;