import React from "react";
import { Button } from "semantic-ui-react";
import { Switch } from "react-router-dom";

export default class CreateExperimentScreen extends React.Component{
    render(){
        return (
            <div className="match-parent create-experiment-screen">
                <div className="sidebar-palette">
                    <div className="absolute-content">
                        THIS IS MY SIDEBAR
                    </div>
                </div>
                <div className="main-content">
                    <div className="stepper-container">
                        HERE IS MY COOL AND GOOD LOOKING STEPPER
                    </div>
                    <div className="current-display center-content">
                        <div className="absolute-content">
                            <div className="configure-component-container">
                                <div className="canvas-view">
                                    HERE IS THE CANVAS
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="content-footer">
                        <Button size="big" primary>NEXT</Button>
                    </div>
                </div>
            </div>
        )
    }
}