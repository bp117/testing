import React from "react";

export default class Header extends React.Component{
    render(){
        return(
            <div className="app-header">
                {this.props.children}
            </div>
        )
    }
}