import React, { Component } from 'react';
import { Switch } from "react-router-dom";
import Header from "../components/Header.jsx";
import "../assets/css/styles.css";
import BreadcrumbNav from '../components/BreadcrumbNav.jsx';
import AppRoutes from './routes.jsx';

class App extends Component{
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
                    <div className="container">
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