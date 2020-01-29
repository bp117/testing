import React, { Component } from 'react';
import { Switch, Redirect } from "react-router-dom";
import Header from "../components/Header.jsx";
import "../assets/css/styles.css";
import BreadcrumbNav from '../components/BreadcrumbNav.jsx';
import AppRoutes from './routes.jsx';
import { HOME_ROUTE } from '../constants/app_routes.js';

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
                <BreadcrumbNav />
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

export default App;