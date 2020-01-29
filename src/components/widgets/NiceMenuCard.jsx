import React from 'react';
import { Segment } from 'semantic-ui-react';
import RippleEffect from "react-ripples";
import PropTypes from "prop-types";

export default function NiceMenuCard(props){
    return (
            <Segment className="nice-menu-card">
                <RippleEffect className="nice-menu-card">
                    <div className="match-parent center-content-col">
                        <div className="nmc-icon">{props.icon}</div>
                        <div className="nmc-text">{props.text}</div>
                    </div>
                </RippleEffect>
            </Segment>
    )
}

NiceMenuCard.propTypes = {
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    text: PropTypes.string.isRequired
}