import React from "react";
import { connect } from "react-redux";

import axios from "axios";
import { getUrl, session, userBillingOptions } from "../../utils/uti";
import store from "../../redux/store";

import "./buy.scss";

class Buy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: [],
            username: "",
            address: "",
            country: "",
            phone: "",

            message: "",
            errorTime: 0,
            messageClassName: "error"
        };
    }

    handleChange = ev => {
        this.setState({ [ev.target.name]: ev.target.type === "number" ? +ev.target.value : ev.target.value });
    };

    async pulsaBuy() {
        //procedemos a dar de alta las compras en la base de datos.

        for (let _y of this.props.cart) {
            //registramos la purchase en la base de datos.
            // Construcción del cuerpo de la purchase individualizada.

            let body = {
                buyerId: this.state.userData._id,
                sellerId: _y.ownerId,
                productId: _y._id,
                originLocation: _y.location,
                destinationCity: this.state.userData.billing.city,
                destinationCountry: this.state.userData.billing.country,
                items: _y.title + " x " + _y.cartQuantity,
                totalValue: _y.price * _y.cartQuantity
            };

            try {
                await axios.post(getUrl(`/purchase/add`), body);

                //Muestro
                this.muestraError("Compra exitosa.", 2, false);

                setTimeout(() => {
                    //vaciamos la cesta.

                    for(let _y of this.props.cart){
                        store.dispatch({
                            type: 'CART_REMOVE',
                            payload: _y._id
                        });
                    }
                    
                    //redireccionamos a main
                    this.props.history.push("/");
                }, 2000);
            } catch (err) {
                if (err.response) {
                    if (err.response.data) {
                        this.muestraError("Ha ocurrido un error.");
                        
                    }
                    return;
                }
                console.log(err);
            }
        }
    }

    async componentDidMount() {
        try {
            let token = session.get().token;
            let id = session.get().userId;
			
            const res = await axios.get(getUrl(`/user/${id}?token=${token}`));

            this.setState({ userData: res.data });
        } catch (err) {
            console.log(err);
        }
    }

    paymentMethod() {
        let userCard = this.state.userData.billing?.card.number;
        let userPaypal = this.state.userData.billing?.paypal;

        let userBilling = userBillingOptions(userCard, userPaypal);

        let hasCard = userBilling !== 1 && userBilling !== 3;
        let hasPaypal = userBilling !== 2 && userBilling !== 3;

        return (
            <div className="userBillField">
                <div className="userBillPayField mt3">
                    <input type="radio" id="huey" name="payment" value="huey" disabled={hasCard} />
                    <img alt="card" className="imgCard ml2 mr2 mb2" src="./img/card.png"></img>
                    <div className="userPayInfo mb2">{this.state.userData.billing?.card.number}</div>
                </div>
                <div className="userBillPayField">
                    <input type="radio" id="dewey" name="payment" value="dewey" disabled={hasPaypal} />
                    <img alt="paypal" className="imgPaypal ml2 mr2 mb2" src="./img/paypal.png"></img>
                    <div className="userPayInfo mb2">{this.state.userData.billing?.paypal}</div>
                </div>
            </div>
        );
    }

    muestraError (message, timeout = 3, isError = true) {
		
		// Pongo la clase
		let className = isError ? "error" : "success";
		this.setState({messageClassName: className});
		
		
		// Pongo el mensaje
		this.setState({message: message});
		
		
		// Ya estoy en loop
		if (this.state.errorTime > 0) {
			this.setState({errorTime: timeout});
			return; // y salgo
		};
		
		
		this.setState({errorTime: timeout}); // Entro por primera vez, pongo tiempo
		
		
		// Loop
		let loop = setInterval( ()=> {
			
			if (this.state.errorTime <= 0) {
				this.setState({message: ""});
				clearInterval(loop); // salgo del loop
			};
			
			
			this.setState( preState => ( {errorTime: preState.errorTime - 1}) );
			
		}, 1000);
		
	};

    render() {
        return (
            <div className="mainBuy mt3">
                {/* <pre>{JSON.stringify(this.state.address, null,2)}</pre> */}
                <div className="Data">
                    <div className="card">
                        <div className="cardHeader">
                            <h1 className="cardTitle"> Dirección de envio: </h1>
                        </div>
                        <div className="cardBody">
                            <div className="userDataField">
                                <input
                                    className="inputShipping mt3"
                                    type="text"
                                    placeholder={this.state.userData.username}
                                    name="username"
                                    value={this.state.username}
                                    onChange={ev => {
                                        this.handleChange(ev);
                                    }}
                                ></input>
                            </div>
                            <div className="userDataField">
                                <input
                                    className="inputShipping"
                                    type="text"
                                    placeholder={this.state.userData.billing?.address}
                                    name="address"
                                    value={this.state.address}
                                    onChange={ev => {
                                        this.handleChange(ev);
                                    }}
                                ></input>
                            </div>
                            <div className="userDataField">
                                <input
                                    className="inputShipping"
                                    type="text"
                                    placeholder={this.state.userData.billing?.city}
                                    name="city"
                                    value={this.state.city}
                                    onChange={ev => {
                                        this.handleChange(ev);
                                    }}
                                ></input>
                            </div>
                            <div className="userDataField">
                                <input
                                    className="inputShipping"
                                    type="text"
                                    placeholder={this.state.userData.billing?.country}
                                    name="country"
                                    value={this.state.country}
                                    onChange={ev => {
                                        this.handleChange(ev);
                                    }}
                                ></input>
                            </div>
                            <div className="userDataField">
                                <input
                                    className="inputShipping"
                                    type="text"
                                    placeholder={this.state.userData?.phone}
                                    name="phone"
                                    value={this.state.phone}
                                    onChange={ev => {
                                        this.handleChange(ev);
                                    }}
                                ></input>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="Cart ml5">
                    <div className="card">
                        <div className="cardHeader">
                            <h1 className="cardTitle"> Método de pago: </h1>
                        </div>
                        <div className="cardBody">{this.paymentMethod()}</div>
                    </div>
                </div>
                <div className="Shipping ml5">
                    <div className="card">
                        <div className="cardHeader">
                            <h1 className="cardTitle"> Productos y envío: </h1>
                        </div>
                        <div className="cardBody">
                            <div className="totalDisplay">
                                <div className="totalTextDisplay mt3">
                                    <div className="totalTitle">Productos:</div>
                                    <div className="totalNum">{this.props.precioTotal}€</div>
                                    {/* <div className="totalNum">1.000.000€</div> */}
                                </div>
                                <div className="totalTextDisplay">
                                    <div className="totalTitle mt3">Gastos de envío:</div>
                                    <div className="totalNum mt3">6€</div>
                                </div>
                                <div className="totalTextDisplay">
                                    <div className="totalTitle mt5">Total:</div>
                                    <div className="totalNum mt5">{this.props.precioTotal + 6}€</div>
                                </div>
                            </div>
                            <div className="buttonContainer mb3">
                                <button
                                    onClick={() => {
                                        this.pulsaBuy();
                                    }}
                                >
                                    Comprar
                                </button>
                            </div>
                            <p className={this.state.messageClassName}> {this.state.message} </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
const mapStateToProps = state => {
    // ese state es de redux
    console.log(state);
    return {
        cart: state.cart,
        precioTotal: state.totalPrice
    };
};
export default connect(mapStateToProps)(Buy);
