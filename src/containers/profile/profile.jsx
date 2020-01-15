import React from "react";

import axios from "axios";
import { getUrl, session, userBillingOptions } from "../../utils/uti";

import "./profile.scss";

class Profile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userData: [],
            userType: ""
        };
    }
	
    async componentDidMount() {
        try {
            let token = session.get().token;
            let id = session.get().userId;
			
            const res = await axios.get(getUrl(`/user/${id}?token=${token}`));
			
            this.setState({ userData: res.data }, () => {
                // this.state.userType = this.state.userData.userType === 0 ? "Cliente" : "Vendedor";
            });
        } catch (err) {
            console.error(err);
        }
    }

    muestraBilling() {
        let userCard = this.state.userData.billing?.card.number;
        let userPaypal = this.state.userData.billing?.paypal;

        let userBilling = userBillingOptions(userCard, userPaypal);

        switch (userBilling) {
            case 1:
                return (
                    <div className="userDataField">
                        <div className="userDataFieldTitle">Tarjeta de Crédito : </div>
                        <div className="userDataFieldContent">{this.state.userData.billing.card.number}</div>
                    </div>
                );

            case 2:
                return (
                    <div className="userDataField">
                        <div className="userDataFieldTitle">Paypal : </div>
                        <div className="userDataFieldContent">{this.state.userData.billing.paypal}</div>
                    </div>
                );

            case 3:
                return (
                    <div className="userBothBilling">
                        <div className="userDataField">
                            <div className="userDataFieldTitle">Tarjeta de Crédito : </div>
                            <div className="userDataFieldContent">{this.state.userData.billing.card.number}</div>
                        </div>
                        <div className="userDataField">
                            <div className="userDataFieldTitle">Paypal : </div>
                            <div className="userDataFieldContent">{this.state.userData.billing.paypal}</div>
                        </div>
                    </div>
                );

            default:
                console.error("default");
        }
    }

    render() {
        let userType = this.state.userData.userType === 1 ? "Cliente" : "Vendedor";

        if (this.state.userData.userType === 3){
            userType = "Administrador";
        };

        return (
            <div className="main mainProfile">
                <div className="card mt3">
                    <div className="cardHeader">
                        <h1 className="cardTitle"> {this.state.userData.username} </h1>

                        <div className="userTypeClass">{userType}</div>
                    </div>
                    <div className="cardBody">
                        <div className="userDataField">
                            <div className="userDataFieldTitle">E-mail : </div>
                            <div className="userDataFieldContent">{this.state.userData.email}</div>
                        </div>
                        <div className="userDataField">
                            <div className="userDataFieldTitle">Teléfono : </div>
                            <div className="userDataFieldContent">{this.state.userData.phone}</div>
                        </div>
                        <div className="userDataField">
                            <div className="userDataFieldTitle">Dirección : </div>
                            <div className="userDataFieldContent">{this.state.userData.billing?.address}</div>
                        </div>
                        <div className="userDataField">
                            <div className="userDataFieldTitle">Ciudad : </div>
                            <div className="userDataFieldContent">{this.state.userData.billing?.city}</div>
                        </div>
                        <div className="userDataField">
                            <div className="userDataFieldTitle">País : </div>
                            <div className="userDataFieldContent">{this.state.userData.billing?.country}</div>
                        </div>
                        {this.muestraBilling()}
                    </div>
                </div>
            </div>
        );
    }
}
export default Profile;
