
import React from "react";
import { session, getUrl} from "../../utils/uti";
import axios from "axios";
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
            const id_empresa = session.get()?.visitor_id;

            //axios...
            const res = await axios.get(getUrl(`/suscripcionesPorE?id_empresa=${id_empresa}`));
            console.log(res);

        }else{
            //buscamos las candidaturas por candidato
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