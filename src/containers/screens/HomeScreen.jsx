import React from "react";
import NiceMenuCard from "../../components/widgets/NiceMenuCard";
import { Icon } from "semantic-ui-react";
import { UPLOAD_COMPONENT_ROUTE, CREATE_EXPERIMENT_ROUTE, UPLOAD_ENVIRONMENT_ROUTE, RUN_EXPERIMENT_ROUTE, RUN_EXPERIMENT_STATUS_ROUTE, RUN_HISTORY_ROUTE } from "../../constants/app_routes";

const menuItems = [
    {
        name: "Component Definition",
        iconName: "check",
        route: UPLOAD_COMPONENT_ROUTE
    },{
        name: "Environment Config",
        iconName: "check",
        route: UPLOAD_ENVIRONMENT_ROUTE
    },{
        name: "Create Experiment",
        iconName: "check",
        route: CREATE_EXPERIMENT_ROUTE
    },{
        name: "Run Experiment",
        iconName: "check",
        route:RUN_EXPERIMENT_ROUTE
    },{
        name: "Run History",
        iconName: "check",
        route: RUN_HISTORY_ROUTE //"/home/run-history"
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
            <div style={{paddingTop:25}}>
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