import React from "react";
import NiceMenuCard from "../../components/widgets/NiceMenuCard";
import { Icon } from "semantic-ui-react";

const menuItems = [
    {
        name: "Component Definition",
        iconName: "check",
        route: "/home/upload-component"
    },{
        name: "Environment Config",
        iconName: "check",
        route: "/home/upload-environment"
    },{
        name: "Create Experiment",
        iconName: "check",
        route: "/home/create-experiment"
    },{
        name: "Run Experiment",
        iconName: "check",
        route: "/home/run-experiment"
    },{
        name: "Run History",
        iconName: "check",
        route: "/home/run-history"
    },{
        name: "Schedules",
        iconName: "check",
        route: "/home/schedules"
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
                                onItemClick={()=>this.handleDispatchRoute(item.route)}/>
                        ))
                    }
                </div>
            </div>
        )
    }
}