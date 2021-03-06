import React, { Component } from 'react';
import { Switch, Redirect, withRouter } from "react-router-dom";
import Header from "../components/Header.jsx";
import BreadcrumbNav from '../components/BreadcrumbNav.jsx';
import AppRoutes from './routes.jsx';
import { HOME_ROUTE, UPLOAD_COMPONENT_ROUTE } from '../constants/app_routes.js';
import "../assets/css/styles.css";
import { Sidebar, Menu, Icon } from 'semantic-ui-react';
import { menuItems } from '../constants/menuItems.js';
import logoImg from "../assets/images/logo.png";

class App extends Component{
    constructor(props){
        super(props);
        this.state = {
            isSidebarVisible: false
        }
    }
    handleToggleSidebar = (state)=>{
        this.setState({
            isSidebarVisible: typeof state == "boolean"? state : !this.state.isSidebarVisible
        })
    }
    handleDispatchRoute = (route)=>{
        this.handleToggleSidebar(false);
        this.props.history.push(route);
    }
    render(){
        return(
            <Sidebar.Pushable>
                <Sidebar
                    as={Menu}
                    animation='overlay'
                    icon='labeled'
                    inverted
                    onHide={() => this.handleToggleSidebar(false)}
                    vertical
                    direction="left"
                    visible={this.state.isSidebarVisible}
                    style={{backgroundColor:"#01579B", width:250}}
                >
                    <Menu.Item as="a" position="left" style={{backgroundColor:"#023f6e"}}>
                        <div style={{width:"100%", height:"100%", display:"flex"}}>
                            <div style={{flex:1, fontSize:16}} onClick={()=>this.handleToggleSidebar(false)}>
                                <Icon name="arrow left" />
                            </div>
                            <div style={{flex:1, fontSize:16, borderLeft:"1px solid whitesmoke"}} onClick={()=>this.handleDispatchRoute(HOME_ROUTE)}>
                                <Icon name="home" />
                            </div>
                        </div>
                    </Menu.Item>
                    {menuItems.map(item=>{
                        return (
                            <Menu.Item as='a' style={{fontSize:16, textAlign:"left"}} onClick={()=>this.handleDispatchRoute(item.route)} key={Math.random()+""}>
                                {item.icon2}<span style={{marginRight:10}} /> {item.name}
                            </Menu.Item>
                        )
                    })}
                </Sidebar>
                <Sidebar.Pusher dimmed={this.state.isSidebarVisible}>
                    <div className="match-parent">
                        <Header onToggleSidebar={this.handleToggleSidebar}>
                            <div style={{marginLeft:20}}>
                                <img src={logoImg} height={48}/>  
                            </div>    
                        </Header>
                        {this.props.location.pathname !== HOME_ROUTE &&
                            <BreadcrumbNav />
                        }
                        <div className="app-content">
                            <div className="mini-sidebar">
                                <div className={`item ${this.props.location.pathname==HOME_ROUTE?"active":""}`} onClick={()=>this.handleDispatchRoute(HOME_ROUTE)}>
                                    <Icon name="home" style={{fontSize:18}}/>
                                </div>
                                {menuItems.map(item=>{
                                    let isSelected = item.route === this.props.location.pathname;
                                    return (
                                        <div className={`item ${isSelected?"active":""}`} onClick={()=>this.handleDispatchRoute(item.route)} key={Math.random()+""}>
                                            {item.icon2}
                                        </div>
                                    )}
                                )}
                            </div>
                            <div style={{height:"100%", flex:1, position:"relative"}}>
                                <div style={{position:"absolute", top:"4em", left:0, right:0, bottom:0}}>
                                    <div className="container" style={{height:"100%"}}>
                                        <Switch>
                                            <AppRoutes />
                                        </Switch>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        )
    }
}

export default withRouter(App);