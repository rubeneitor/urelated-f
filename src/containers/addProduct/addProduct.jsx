import React from "react";

import axios from "axios";
import { getUrl, session } from "../../utils/uti";
import DropdownCategories from "../../components/dropdownCategories/dropdownCategories";

import "./addProduct.scss";

class AddProduct extends React.Component {
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
            isActive: "false",

            message: "",
            errorTime: 0,
            messageClassName: "error"
        };

        this.pulsaProduct = this.pulsaProduct.bind(this);
    }

    componentDidMount() {
        this.updateDescriptionRemainingCharacters();
    }

    handleChange = ev => {
        this.setState({ [ev.target.name]: ev.target.type === "number" ? +ev.target.value : ev.target.value });

        // Excepción para medir caracteres restantes en la descripción
        if (ev.target.name === "description") {
            this.updateDescriptionRemainingCharacters();
        }
    };

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

    resetState() {
        this.setState({
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
            isActive: "false",

            message: "",
            errorTime: 0,
            messageClassName: "error"
        });
    }

    async pulsaProduct() {
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

        //Procedemos a introducir el producto en la base de datos

        try {
            let imagesArray = [this.state.image1, this.state.image2, this.state.image3, this.state.image4];
            let sessionData = session.get();

            // Construcción del cuerpo del producto.
            let body = {
                ownerId: sessionData.userId,
                category: this.state.category,
                imageUrl: imagesArray,
                title: this.state.titulo.trim(),
                description: this.state.description.trim(),
                price: price,
                stock: stock,
                activeStock: stockActivo,
                location: this.state.location.trim(),
                isActive: this.state.isActive === "true"
            };

            await axios.post(getUrl(`/product/add?token=${sessionData.token}`), body);

            // Muestro
            this.muestraError("Producto añadido.", 2, false);

            setTimeout(() => {
                this.resetState();
            }, 2000);
        } catch (err) {
            if (err.response) {
                if (err.response.data) {
                    this.muestraError("Ha ocurrido un error añadiendo el producto.");
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
                <div className="addProductCard">
                    <h2>Añade un nuevo producto</h2>
                    <div className="productRegisterFieldsA">
                        <input className="inputaddProduct" type="text" placeholder="Título" name="titulo" maxLength="50" value={this.state.titulo} onChange={this.handleChange}></input>
                        <input className="inputaddProduct" type="text" placeholder="Precio" name="precio" value={this.state.precio} onChange={this.handleChange}></input>
                        <input className="inputaddProduct" type="text" placeholder="Stock" name="stock" value={this.state.stock} onChange={this.handleChange}></input>
                        <input className="inputaddProduct" type="text" placeholder="Stock Activo" name="stockActivo" value={this.state.stockActivo} onChange={this.handleChange}></input>
                        <input className="inputaddProduct" type="text" placeholder="Localizacion" name="location" value={this.state.location} onChange={this.handleChange}></input>

                        <DropdownCategories category={this.state.category} handleChange={this.handleChange} defaultCategory={"Elige una categoría"} />

                        <input className="inputaddProduct" type="text" placeholder="Link imagen 1" name="image1" value={this.state.image1} onChange={this.handleChange}></input>
                        <input className="inputaddProduct" type="text" placeholder="Link imagen 2" name="image2" value={this.state.image2} onChange={this.handleChange}></input>
                        <input className="inputaddProduct" type="text" placeholder="Link imagen 3" name="image3" value={this.state.image3} onChange={this.handleChange}></input>
                        <input className="inputaddProduct" type="text" placeholder="Link imagen 4" name="image4" value={this.state.image4} onChange={this.handleChange}></input>
                    </div>
                    <div className="productRegisterFieldsB">
                        <textarea
                            className="textAddProduct"
                            rows="5"
                            cols="60"
                            maxLength="400"
                            placeholder="Add product description here."
                            name="description"
                            value={this.state.description}
                            onChange={this.handleChange}
                        ></textarea>
                        <span id="descriptionRemainingCharacters"></span>

                        <select className="addProductDropdown br" name="isActive" value={this.state.isActive} onChange={this.handleChange}>
                            <option value="false">Oculto</option>
                            <option value="true">A la venta</option>
                        </select>
                    </div>

                    <button onClick={this.pulsaProduct}>Añadir</button>
                    <p className={this.state.messageClassName}> {this.state.message} </p>
                </div>

                <div className="previewCard ml5">
                    {/* <pre>{JSON.stringify(this.state, null,2)}</pre> */}
                    <div className="previewImage">
                        <img className="ml5 imagePreOne" src={this.state.image1} name="imagenUser" alt="" ></img>
                    </div>
                    <div className="previewText">
                        <pre>
                            <div className="preTitle mt5 mb5 ml5">
                                <h2>{this.state.titulo}</h2>
                            </div>
                        </pre>
                        <pre>
                            <div className="preTitle mt5 ml5">
                                <h4>{this.state.precio}</h4>
                            </div>
                        </pre>
                        <pre>
                            <div className="preDescription mt5 ml5">
                                <textarea className="textAddProductTwo" rows="5" cols="50" maxLength="400" disabled={true} value={this.state.description}></textarea>
                            </div>
                        </pre>
                    </div>
                </div>
            </div>
        );
    }
}

export default AddProduct;
