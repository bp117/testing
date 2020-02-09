import React, { Component } from 'react';
import { Switch, Redirect, withRouter } from "react-router-dom";
import Header from "../components/Header.jsx";
import BreadcrumbNav from '../components/BreadcrumbNav.jsx';
import AppRoutes from './routes.jsx';
import { HOME_ROUTE } from '../constants/app_routes.js';
import "../assets/css/styles.css";

class App extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div className="match-parent">
                <Header>
                    <div className="container">
                        <h2 className="brand-name">Chaos Testing</h2>  
                    </div>    
                </Header>
                {this.props.location.pathname !== HOME_ROUTE &&
                    <BreadcrumbNav />
                }
				<div className="app-content">
                    <div className="container" style={{height:"100%"}}>
                        <Switch>
                            <AppRoutes />
                        </Switch>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(App);