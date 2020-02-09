import React from "react";
import NiceMenuCard from "../../components/widgets/NiceMenuCard";
import { Icon } from "semantic-ui-react";
import { UPLOAD_COMPONENT_ROUTE, CREATE_EXPERIMENT_ROUTE, UPLOAD_ENVIRONMENT_ROUTE, RUN_EXPERIMENT_ROUTE, RUN_EXPERIMENT_STATUS_ROUTE, RUN_HISTORY_ROUTE } from "../../constants/app_routes";
import { menuItems } from "../../constants/menuItems";


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