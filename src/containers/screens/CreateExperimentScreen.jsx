import React from "react";
import { Button, Step, Icon } from "semantic-ui-react";
import { Switch } from "react-router-dom";

const PaletteMenuItem = (props)=>(
    <div className="palette-item-container">
        <div className="palette-item">
            <h4>Item Name</h4>
        </div>
    </div>
)

export default class CreateExperimentScreen extends React.Component{
    render(){
        return (
            <div className="match-parent create-experiment-screen">
                <div className="sidebar-palette">
                    <div className="header">Components Palette</div>
                    <div style={{flex:1, position:"relative"}}>
                        <div className="absolute-content">
                            <PaletteMenuItem />
                            <PaletteMenuItem />
                            <PaletteMenuItem />
                            <PaletteMenuItem />
                            <PaletteMenuItem />
                        </div>
                    </div>
                </div>
                <div className="main-content">
                    <div className="stepper-container">
                        <Step.Group style={{width:"80%", padding:0}}>
                            <Step active link>
                                <Icon name='configure' />
                                <Step.Content>
                                    <Step.Title style={{fontSize:16,}}>Configure Component</Step.Title>
                                </Step.Content>
                            </Step>
                            <Step link>
                                <Icon name='lab' />
                                <Step.Content>
                                    <Step.Title style={{fontSize:16}}>Configure Experiment</Step.Title>
                                </Step.Content>
                            </Step>
                        </Step.Group>
                    </div>
                    <div className="current-display center-content">
                        <div className="absolute-content">
                            <div className="match-parent center-content">
                                <div className="canvas-view">
                                    <div className="header">  Component Canvas  </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="content-footer">
                        <Button size="big" primary>NEXT <Icon name="arrow right" /> </Button>
                    </div>
                </div>
            </div>
        )
    }
}