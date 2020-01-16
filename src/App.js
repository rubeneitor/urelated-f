
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// Componentes
import Home from "./containers/home/home";
import Header from "./components/header/header";
import SearchResults from "./containers/searchResults/searchResults";
import ProductDetail from "./containers/productDetail/productDetail";
import LoginC from "./containers/loginC/loginC";
import LoginE from "./containers/loginE/loginE";
import Profile from "./containers/profile/profile";
import RegisterC from "./containers/registerC/registerC";
import RegisterE from "./containers/registerE/registerE";
import PasswordRecovery from "./containers/passwordRecovery/passwordRecovery";
import Admin from "./containers/admin/admin";
import Facturas from "./containers/facturas/facturas";
import AddProduct from "./containers/addProduct/addProduct";
import editProduct from "./containers/editProduct/editProduct";
import Cesta from "./containers/cesta/cesta";
import Buy from "./containers/buy/buy";
import Storage from "./containers/inventario/storage";
import Footer from "./components/footer/footer";


// CSS
import "./global.css";
import "./App.css";

export default function App() {
	return (
		<div>
			<Router>
				
				<Header/>
				
				<Switch>
					<Route path="/" exact component={Home} />
					<Route path="/loginC" exact component={LoginC} />
					<Route path="/loginE" exact component={LoginE} />
					<Route path="/registerC" exact component={RegisterC} />
					<Route path="/registerE" exact component={RegisterE} />
					<Route path="/profile" exact component={Profile} />
					<Route path="/passwordRecovery" exact component={PasswordRecovery} />
					<Route path="/admin" exact component={Admin} />
					<Route path="/facturas" exact component={Facturas} />
					
					<Route path="/search" exact component={SearchResults} />
					<Route path="/detail" exact component={ProductDetail} />
					<Route path="/cart" exact component={Cesta} />
					<Route path="/buy" exact component={Buy} />
					<Route path="/storage" exact component={Storage} />
					<Route path="/editProduct" exact component={editProduct} />
					
					<Route path="/addProduct" exact component={AddProduct} />
					
				</Switch>
				<Footer/>
			</Router>
		</div>
	);
}



