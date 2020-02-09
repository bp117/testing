import React from "react";
import { withRouter } from "react-router-dom";

class Header extends React.Component{
    componentWillReceiveProps(nextProps){
        console.log("NEXT PROPS ", nextProps)
    }
    render(){
        return(
            <div className="app-header">
                {this.props.children}
            </div>
        )
    }
}

export default withRouter(Header);