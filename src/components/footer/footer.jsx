import React from "react";

import "./footer.scss";

class Footer extends React.Component {
    render() {
        return (
            <div className="footer">
                <div className="footerInfoContainer ml5">
                    <div className="blank"></div>
                    <div className="brand">uRelated</div>
                    <div className="policy">
                        <div className="faq">FAQ</div>
                        <div className="privacy ml3">Política de privacidad</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Footer;
