import React from "react";
import { Route, Redirect } from "react-router-dom";
import { HOME_ROUTE, UPLOAD_COMPONENT_ROUTE, CREATE_EXPERIMENT_ROUTE, UPLOAD_ENVIRONMENT_ROUTE, RUN_EXPERIMENT_ROUTE } from "../constants/app_routes";
import HomeScreen from "./screens/HomeScreen";
import ComponentUploadScreen from "./screens/component-upload/ComponentUploadScreen";
import CreateExperimentScreen from "./screens/create-experiment/CreateExperimentScreen";
import EnvironmentUploadScreen from "./screens/environment-upload/EnvironmentUploadScreen";
import RunExperimentScreen from "./screens/run-experiment/RunExperimentScreen";

export default class AppRoutes extends React.Component{
    _routeExists = (route)=>{
        return [
            HOME_ROUTE, 
            UPLOAD_COMPONENT_ROUTE, 
            UPLOAD_ENVIRONMENT_ROUTE,
            CREATE_EXPERIMENT_ROUTE,
            RUN_EXPERIMENT_ROUTE
        ].includes(route)
    }
    render(){
        let route = this.props.location.pathname;
        return (
            <React.Fragment>
                <Route path={HOME_ROUTE} render={(props)=><HomeScreen {...props} />} exact/>
                <Route path={UPLOAD_COMPONENT_ROUTE} render={(props)=><ComponentUploadScreen {...props} />} exact/>
                <Route path={UPLOAD_ENVIRONMENT_ROUTE} render={(props)=><EnvironmentUploadScreen {...props} />} exact/>
                <Route path={CREATE_EXPERIMENT_ROUTE} render={(props)=><CreateExperimentScreen {...props} />} exact/>
                <Route path={RUN_EXPERIMENT_ROUTE} render={(props)=><RunExperimentScreen {...props} />} exact/>

                <Route exact path="*" render={() => ( <Redirect to={this._routeExists(route)?route:HOME_ROUTE}/> )} />
            </React.Fragment>
        )
    }
}