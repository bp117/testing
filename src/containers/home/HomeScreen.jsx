import React from "react";
import NiceMenuCard from "../../components/widgets/NiceMenuCard";
import { Icon } from "semantic-ui-react";

const menuItems = [
    {
        name: "Component Definition",
        iconName: "check",
        route: "/"
    },{
        name: "Environment Config",
        iconName: "check",
        route: "/"
    },{
        name: "Create Experiment",
        iconName: "check",
        route: "/"
    },{
        name: "Run Experiment",
        iconName: "check",
        route: "/"
    },{
        name: "Run History",
        iconName: "check",
        route: "/"
    },{
        name: "Schedules",
        iconName: "check",
        route: "/"
    }
]

export default class HomeScreen extends React.Component {
    handleDispatchRoute = (route)=>{
        this.props.history.push(route);
    }
    render(){
        return(
            <div className="match-parent" style={{paddingTop:25}}>
                <div className="d-flex match-parent center-content">
                    {
                        menuItems.map(item=>(
                            <NiceMenuCard 
                                text={item.name} 
                                icon={<Icon name="accessible" />}
                                onClick={()=>this.handleDispatchRoute(item.route)}/>
                        ))
                    }
                </div>
            </div>
        )
    }
}