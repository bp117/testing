import React from "react";
import { withRouter } from "react-router-dom";
import { Icon } from "semantic-ui-react";

class Header extends React.Component{
    render(){
        return(
            <div className="app-header">
                <div className="menu-icon">
                    <Icon name="content" size="big" onClick={()=>this.props.onToggleSidebar(true)}/>
                </div>
                {this.props.children}
            </div>
        )
    }
}

export default withRouter(Header);