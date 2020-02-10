
import React from "react";

import "./input.scss";

class Input extends React.Component {
    
    
    render() {
        return(
            <input
                type="text"
                placeholder={this.props.placeholder}
                onChange={this.props.handleChange}
                value={this.props.value}
                name={this.props.name}
            />
        );
    };
    
    
};


export default Input;