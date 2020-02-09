import React from "react";
import { Icon } from "semantic-ui-react";
import { UPLOAD_COMPONENT_ROUTE, UPLOAD_ENVIRONMENT_ROUTE, CREATE_EXPERIMENT_ROUTE, RUN_EXPERIMENT_ROUTE, RUN_HISTORY_ROUTE, SCHEDULES_ROUTE } from "./app_routes";

export const menuItems = [
    {
        name: "Component Definition",
        icon:   <Icon.Group size="large">
                    <Icon name='file alternate' style={{color:"#01579B"}}/>
                    <Icon corner="bottom right" style={{fontSize:18, color:"#00BFA5"}} name='add' />
                </Icon.Group>,
        icon2:  <Icon.Group size="large">
                    <Icon name='file alternate'/>
                    <Icon corner="bottom right" style={{fontSize:12, color:"#00BFA5"}} name='add' />
                </Icon.Group>,
        route: UPLOAD_COMPONENT_ROUTE
    },{
        name: "Environment Config",
        icon:   <Icon.Group size="large">
                    <Icon name='file alternate outline' style={{color:"#01579B"}} />
                    <Icon corner="bottom right" style={{fontSize:18, color:"#00BFA5"}} name='add' />
                </Icon.Group>,
        icon2:   <Icon.Group size="large">
                    <Icon name='file alternate outline'/>
                    <Icon corner="bottom right" style={{fontSize:12, color:"#00BFA5"}} name='add' />
                </Icon.Group>,
        route: UPLOAD_ENVIRONMENT_ROUTE
    },{
        name: "Create Experiment",
        icon:   <Icon.Group size="large">
                    <Icon name='lab' style={{color:"#01579B"}} />
                    <Icon corner="bottom right" style={{fontSize:18, color:"#F57C00"}} name='setting' />
                </Icon.Group>,
        icon2:  <Icon.Group size="large">
                    <Icon name='lab' />
                    <Icon corner="bottom right" style={{fontSize:12, color:"#F57C00"}} name='setting' />
                </Icon.Group>,
        route: CREATE_EXPERIMENT_ROUTE
    },{
        name: "Run Experiment",
        icon:   <Icon.Group size="large">
                    <Icon name='lab' style={{color:"#01579B"}} />
                    <Icon corner="bottom right" style={{fontSize:18, color:"#F57C00"}} name='play' />
                </Icon.Group>,
        icon2:   <Icon.Group size="large">
                    <Icon name='lab'/>
                    <Icon corner="bottom right" style={{fontSize:12, color:"#F57C00"}} name='play' />
                </Icon.Group>,
        route:RUN_EXPERIMENT_ROUTE
    },{
        name: "Run History",
        icon: <Icon name='history' size="large" style={{color:"#01579B"}}/>,
        icon2: <Icon.Group size="large"><Icon name='history' /> </Icon.Group>,
        route: RUN_HISTORY_ROUTE
    },{
        name: "Schedules",
        icon: <Icon name="calendar check" size="large" style={{color:"#01579B"}}/>,
        icon2: <Icon.Group size="large"><Icon name="calendar check" /> </Icon.Group>,
        route: SCHEDULES_ROUTE
    }
]