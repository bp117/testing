import React from "react";
import NiceMenuCard from "../../components/widgets/NiceMenuCard";
import { Icon } from "semantic-ui-react";
import { UPLOAD_COMPONENT_ROUTE, CREATE_EXPERIMENT_ROUTE, UPLOAD_ENVIRONMENT_ROUTE, RUN_EXPERIMENT_ROUTE, RUN_EXPERIMENT_STATUS_ROUTE, RUN_HISTORY_ROUTE } from "../../constants/app_routes";

const menuItems = [
    {
        name: "Component Definition",
        icon:   <Icon.Group size="large">
                    <Icon name='file alternate' style={{color:"#01579B"}}/>
                    <Icon corner="bottom right" style={{fontSize:18, color:"#00BFA5"}} name='add' />
                </Icon.Group>,
        route: UPLOAD_COMPONENT_ROUTE
    },{
        name: "Environment Config",
        icon:   <Icon.Group size="large">
                    <Icon name='file alternate outline' style={{color:"#01579B"}} />
                    <Icon corner="bottom right" style={{fontSize:18, color:"#00BFA5"}} name='add' />
                </Icon.Group>,
        route: UPLOAD_ENVIRONMENT_ROUTE
    },{
        name: "Create Experiment",
        icon:   <Icon.Group size="large">
                    <Icon name='lab' style={{color:"#01579B"}} />
                    <Icon corner="bottom right" style={{fontSize:18, color:"#F57C00"}} name='setting' />
                </Icon.Group>,
        route: CREATE_EXPERIMENT_ROUTE
    },{
        name: "Run Experiment",
        icon:   <Icon.Group size="large">
                    <Icon name='lab' style={{color:"#01579B"}} />
                    <Icon corner="bottom right" style={{fontSize:18, color:"#F57C00"}} name='play' />
                </Icon.Group>,
        route:RUN_EXPERIMENT_ROUTE
    },{
        name: "Run History",
        icon: <Icon name='history' size="large" style={{color:"#01579B"}}/>,
        route: RUN_HISTORY_ROUTE //"/home/run-history"
    },{
        name: "Schedules",
        icon: <Icon name="calendar check" size="large" style={{color:"#01579B"}}/>,
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
                                icon={item.icon}
                                onItemClick={()=>this.handleDispatchRoute(item.route)}/>
                        ))
                    }
                </div>
            </div>
        )
    }
}