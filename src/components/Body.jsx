import React from "react";

export default class Body extends React.Component {
    render() {
        const {container, centerContent, style} =this.props;
        return (
            <div className={`match-parent ${container?"container":""} ${centerContent?"center-content":""}`} style={style}>
                {this.props.children}
            </div>
        )
    }
}