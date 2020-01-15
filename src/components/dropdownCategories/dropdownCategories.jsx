
import React from "react";


const DropdownCategories = props=> {
	
		return(
			<select className="categoryDropdown br" name="category" value={props.category} onChange={props.handleChange}>
				<option value="">{props.defaultCategory}</option>
				<option value="aut">Automóvil</option>
				<option value="ali">Alimentación</option>
				<option value="bri">Bricolaje</option>
				<option value="cul">Cultura</option>
				<option value="dep">Deporte</option>
				<option value="electrod">Electrodomésticos</option>
				<option value="electron">Electrónica</option>
				<option value="hog">Hogar</option>
				<option value="jug">Juguetes</option>
				<option value="vid">Videojuegos</option>
				<option value="mod">Moda</option>
				<option value="ofi">Oficina</option>
				<option value="par">Parafarmacia</option>
				<option value="cos">Cosmética</option>
				<option value="otr">Otros</option>
			</select>
		);
};


export default DropdownCategories;
