import React from "react";
import { Route, Redirect } from "react-router-dom";
import { HOME_ROUTE, UPLOAD_COMPONENT_ROUTE } from "../constants/app_routes";
import HomeScreen from "./screens/HomeScreen";
import ComponentUploadScreen from "./screens/ComponentUploadScreen";

export default class AppRoutes extends React.Component{
    render(){
        return (
            <React.Fragment>
                <Route path={HOME_ROUTE} render={(props)=><HomeScreen {...props} />} exact/>
                <Route path={UPLOAD_COMPONENT_ROUTE} render={(props)=><ComponentUploadScreen {...props} />} exact/>

                <Route exact path="*" render={() => ( <Redirect to={HOME_ROUTE}/> )} />
            </React.Fragment>
        )
    }
}