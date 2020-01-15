import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { listaCategorias } from '../../utils/uti';
import axios from "axios";
import queryString from 'query-string';

import "./editProduct.scss";

import { rdx_productDetail } from "../../redux/actions/products";
import { getUrl, session } from "../../utils/uti";
import DropdownCategories from "../../components/dropdownCategories/dropdownCategories";



class editProduct extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
            titulo: "",
            precio: "",
            stock: "",
            stockActivo: "",
            location: "",
            category: "",
            description: "",
            image1: "",
            image2: "",
            image3: "",
            image4: "",
            isActive: "true",

            message: "",
            errorTime: 0,
            messageClassName: "error"
        }
        
        this.pulsaEditProduct = this.pulsaEditProduct.bind(this);
		
	};
	
	componentDidUpdate() {
		this.render();
    };

    handleChange = ev => {
        this.setState({ [ev.target.name]: ev.target.type === "number" ? +ev.target.value : ev.target.value });

        // Excepción para medir caracteres restantes en la descripción
        if (ev.target.name === "description") {
            this.updateDescriptionRemainingCharacters();
        }
    };
    
    async componentDidMount () {

        this.updateDescriptionRemainingCharacters();

        // Busco query
		const queries = queryString.parse(this.props.location.search);
		
		if (! this.props.productData && queries.id) { // no tengo el prop y tengo param
			
			try {
				
				// Pido info
				let res = await axios.get( getUrl(`/product/get?id=${queries.id}`) );
				
				// Guardo en redux
				rdx_productDetail(res.data[0]);
				
			} catch (err) {
				console.log( err );
			};
			
        };
        
        //Traducimos la categoría.
        
        this.setState({category: listaCategorias[this.props.productData?.category[0]]});

        //Seteamos el state de todos los campos.
        this.setState({titulo: this.props.productData?.title});
        this.setState({precio: this.props.productData?.price});
        this.setState({stock: this.props.productData?.stock});
        this.setState({stockActivo: this.props.productData?.activeStock});
        this.setState({location: this.props.productData?.location});
        this.setState({isActive: this.props.productData?.isActive});
        this.setState({image1: this.props.productData?.imageUrl[0]});
        this.setState({image2: this.props.productData?.imageUrl[1]});
        this.setState({image3: this.props.productData?.imageUrl[2]});
        this.setState({image4: this.props.productData?.imageUrl[3]});
        this.setState({description: this.props.productData?.description});
    }

    

    updateDescriptionRemainingCharacters() {
        let ele = document.querySelector(".textAddProduct");
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

    async pulsaEditProduct () {
        //Comprobamos que todos los campos esten rellenados

        let price = parseInt(this.state.precio);
        let stock = parseInt(this.state.stock);
        let stockActivo = parseInt(this.state.stockActivo);

        let arraddProduct = ["titulo", "precio", "stock", "stockActivo", "location", "category", "description", "image1"];

        for (let _x of arraddProduct) {
            if (this.state[_x] === "") {
                this.muestraError(`El campo ${_x} no puede estar vacío`);
                return;
            }
        }

        if (this.state.titulo.length < 3) {
            this.muestraError("El titulo debe de tener al menos 3 caracteres.");
            return;
        }

        if (!/[0-9]/g.test(price)) {
            this.muestraError("El precio debe ser válido.");
            return;
        }

        if (!/[0-9]/g.test(stock)) {
            this.muestraError("El stock debe ser válido.");
            return;
        }

        if (!/[0-9]/g.test(stockActivo)) {
            this.muestraError("El stock activo debe ser válido.");
            return;
        }

        if (stockActivo > stock) {
            this.muestraError("El stock activo no puede ser mayor que el stock.");

            return;
        }

        if (!/[a-z0-9]+/gi.test(this.state.location)) {
            this.muestraError("La localización debe ser válida.");
            return;
        }

        try {
            let imagesArray = [this.state.image1, this.state.image2, this.state.image3, this.state.image4];
            let sessionData = session.get();
            
            // Construcción del cuerpo del producto.
            let body = {
                productId: this.props.productData._id,
                imageUrl: imagesArray,
                title: this.state.titulo.trim(),
                description: this.state.description.trim(),
                location: this.state.location.trim(),
                category: this.state.category,
                price: this.state.precio,
                stock: this.state.stock,
                activeStock: this.state.stockActivo,
                isActive: this.state.isActive 
            };


            await axios.post(getUrl(`/product/edit?token=${sessionData.token}`), body);

            // Muestro
            this.muestraError("Producto modificado.", 2, false);

            setTimeout(() => {
                this.props.history.push("/storage");
            }, 2000);
        } catch (err) {
            if (err.response) {
                if (err.response.data) {
                    this.muestraError("Ha ocurrido un error modificando el producto.");
                }
            }
        }
        
    }

    muestraError(message, timeout = 3, isError = true) {
        // Pongo la clase
        let className = isError ? "error" : "success";
        this.setState({ messageClassName: className });

        // Pongo el mensaje
        this.setState({ message: message });

        // Ya estoy en loop
        if (this.state.errorTime > 0) {
            this.setState({ errorTime: timeout });
            return; // y salgo
        }

        this.setState({ errorTime: timeout }); // Entro por primera vez, pongo tiempo

        // Loop
        let loop = setInterval(() => {
            if (this.state.errorTime <= 0) {
                this.setState({ message: "" });
                clearInterval(loop); // salgo del loop
            }

            this.setState(preState => ({ errorTime: preState.errorTime - 1 }));
        }, 1000);
    }
	
	render() {
		
		return (
			<div className="addProductMain">
            {/* <pre>{JSON.stringify(this.state, null,2)}</pre> */}

                { this.props.productData && 

                <div className="addProductCard">
                    <h2>Edita un Producto</h2>
                    <div className="productRegisterFieldsA">
                        <input className="inputaddProduct" type="text" placeholder={this.state.titulo} name="titulo" maxLength="50" value={this.state.titulo} onChange={this.handleChange}></input>
                        <input className="inputaddProduct" type="text" placeholder={this.state.precio} name="precio" value={this.state.precio} onChange={this.handleChange}></input>
                        <input className="inputaddProduct" type="text" placeholder={this.state.stock} name="stock" value={this.state.stock} onChange={this.handleChange}></input>
                        <input className="inputaddProduct" type="text" placeholder={this.state.stockActivo} name="stockActivo" value={this.state.stockActivo} onChange={this.handleChange}></input>
                        <input className="inputaddProduct" type="text" placeholder={this.props.productData.location} name="location" value={this.state.location} onChange={this.handleChange}></input>
                        
                        <DropdownCategories category={this.category} handleChange={this.handleChange} defaultCategory={this.state.category} />

                        <input className="inputaddProduct" type="text" placeholder={this.state.image1} name="image1" value={this.state.image1} onChange={this.handleChange}></input>
                        <input className="inputaddProduct" type="text" placeholder={this.state.image2} name="image2" value={this.state.image2} onChange={this.handleChange}></input>
                        <input className="inputaddProduct" type="text" placeholder={this.state.image3} name="image3" value={this.state.image3} onChange={this.handleChange}></input>
                        <input className="inputaddProduct" type="text" placeholder={this.state.image4} name="image4" value={this.state.image4} onChange={this.handleChange}></input>
                    </div>
                    <div className="productRegisterFieldsB">
                        <textarea
                            className="textAddProduct"
                            rows="5"
                            cols="60"
                            maxLength="400"
                            placeholder={this.state.description}
                            name="description"
                            value={this.state.description}
                            onChange={this.handleChange}
                        ></textarea>
                        <span id="descriptionRemainingCharacters"></span>

                        <select className="addProductDropdown br" name="isActive" value={this.state.isActive} onChange={this.handleChange} defaultValue={this.props.productData.isActive}>
                            <option value="false">Oculto</option>
                            <option value="true">A la venta</option>
                        </select>
                    </div>

                    <button onClick={this.pulsaEditProduct}>Editar</button>
                    <p className={this.state.messageClassName}> {this.state.message} </p>
                </div>

                } 
            </div>
			
		);
	}
}

const mapStateToProps = (state) => { // ese state es de redux
	return ({
		keywords: state.keywords,
        productSearchResults: state.productSearchResults,
        productData: state.productData,
		isLoggedIn: state.isLoggedIn
	})
}


export default connect(mapStateToProps) (withRouter(editProduct));