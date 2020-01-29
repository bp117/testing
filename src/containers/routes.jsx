import React from "react";
import { Route } from "react-router-dom";
import { HOME_ROUTE } from "../constants/app_routes";
import HomeScreen from "./home/HomeScreen";

export default class AppRoutes extends React.Component{
    render(){
        return (
            <React.Fragment>
                <Route path={HOME_ROUTE} render={(props)=><HomeScreen {...props} />} exact/>
            </React.Fragment>
        )
    }
}