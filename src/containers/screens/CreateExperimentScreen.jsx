import React from "react";
import ReactDOM from "react-dom";
import { Button, Step, Icon } from "semantic-ui-react";
import { Switch, Route } from "react-router-dom";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { showWarningNotification, showErrorNotification, confirmationAlert } from "../../components/utils/alerts";
import { connect } from "react-redux";
import * as actions from "../../actions/componentActions";
import {bindActionCreators} from "redux";
import {jsPlumb} from "jsplumb"
import { CONFIGURE_COMPONENT_ROUTE, CREATE_EXPERIMENT_ROUTE, CONFIGURE_EXPERIMENT_ROUTE } from "../../constants/app_routes";

function mapStateToProps(state){
    return {
        components: state.components.components
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(actions, dispatch);
}


const DraggablePaletteMenuItem = (props)=>(
    <Draggable draggableId={props.id+" "+props.index} index={props.index}>
        {(provided, snapshot) => (
            <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                onDoubleClick={() => {
                    props.onEditTaskItem();
                }}
            >
                <PaletteMenuItem {...props}/>
            </div>
        )}
    </Draggable>
)

const PaletteMenuItem = (props)=>(
    <div className="palette-item-container">
        <div className="palette-item">
            <h4>{props.name}</h4>
        </div>
    </div>
)

const ConfigComponentItem = (props)=>{
    return (
        <div className="configure-comp-container">
            <div className="configure-comp-item" ref={props.itemRef}>
                <h4>{props.name}</h4>
            </div>
            <div className="controls">
                <Button negative onClick={()=>props.onRemove(props._id)}><Icon name="trash" /> Remove</Button>
            </div>
        </div>
    )
}

const ConfigureComponentView = (props)=>(
    <div className={"match-parent center-content "+(props.isActive?"":"hidden")}>
        <div className="canvas-view">
            <div className="header">  Component Canvas  </div>
            <div className="body">
                <div className="absolute-content">
                    <Droppable droppableId="#canvas-droppable-view">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={{ backgroundColor: snapshot.isDraggingOver && "#E3F2FD" }}
                            className="match-parent"
                        >
                            {props.componentNodes.map(item=>(
                                <ConfigComponentItem 
                                    {...item} 
                                    key={item._id} 
                                    itemRef={props.nodeRefList[item._id]} 
                                    onRemove={props.onRemoveCompConfig} />
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                    </Droppable>
                </div>
            </div>
        </div>
    </div>
)

const ConfigureExperimentView = (props)=>(
    <div className={"match-parent center-content "+(props.isActive?"":"hidden")}>
        EXPERIMENT VIEW
    </div>
)

class CreateExperimentScreen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            componentNodes: [],
            currentStep: "CONFIGURE_COMPONENT"
        }
        this.nodeRefs = {}
        this.jsPlumb = jsPlumb.getInstance({
            PaintStyle:{ 
              strokeWidth:3, 
              stroke:"#BF360C"
            },
            ConnectionOverlays: [["Arrow", {location: 0.5, width:15, length:15}]],
            Connector:[ "Bezier", { curviness: 100 } ],
            Endpoint:[ "Rectangle", { radius:7 } ],
            EndpointStyle : { fill: "#567567"  },
            Anchor : [ "Continuous", {} ]
        });
        this.jsPlumb.bind("beforeDetach", ()=>{
            return confirm("Detach this connection link?")
        })
    }

    handleComponentDropped = (data)=>{
        // if(this.state.componentNodes.length === 2){
        //     showWarningNotification("You cannot add more than two components to the canvas");
        // }
        if(data.destination && data.destination.droppableId != data.source.droppableId){
            let draggedCompId = data.draggableId.substring(0, data.draggableId.lastIndexOf(" ")).trim(); 
            let draggedComp = this.props.components.find(item=>item.id===draggedCompId);
            if(draggedComp && !this.state.componentNodes.find(item=>item.id==draggedCompId)){
                this.nodeRefs = {...this.nodeRefs, [draggedComp._id]:React.createRef()}
                this.setState({componentNodes:[
                    ...this.state.componentNodes, 
                    draggedComp
                ]});
            }else{
                showWarningNotification(data.draggableId+" is already added to the component canvas")
            }
        }
    }
    handleRemoveComponentConfig = (compId)=>{
        confirmationAlert("Are you sure you want to remove this component?", ()=>{
            let domNode = ReactDOM.findDOMNode(this.nodeRefs[compId].current)
            this.jsPlumb.remove(domNode)
            delete this.nodeRefs[compId]
            this.setState({componentNodes:this.state.componentNodes.filter(item=>item._id!==compId)}, ()=>{
                this.jsPlumb.repaintEverything(false)
            });
        })
    }
    handleMoveToConfigureExp = ()=>{
        let allConnections = this.jsPlumb.getAllConnections();
        this.setState({currentStep: "CONFIGURE_EXPERIMENT"})
    }
    handleMoveToConfigureComp = ()=> {
        this.setState({currentStep: "CONFIGURE_COMPONENT"})
    }
    _loadComponentDefinitions = ()=>{
        this.props.getComponentDefinition((success, error)=>{
            if(!success){
                showErrorNotification(`Something went wrong: "${error}"`)
            }
        });
    }
    componentDidMount(){
        this._loadComponentDefinitions();
        this.jsPlumb.setContainer("jsplumb-container")
    }
    componentDidUpdate(){
        this.state.componentNodes.forEach(node=>{
            let domNode = ReactDOM.findDOMNode(this.nodeRefs[node._id].current)
            this.jsPlumb.addEndpoint(domNode, {anchor:"RightMiddle"}, {isSource:true, isTarget:true});
        })
    }
    render(){
        return (
            <div className="match-parent create-experiment-screen">
                <DragDropContext onDragEnd={this.handleComponentDropped}>
                    <div className="sidebar-palette">
                        <div className="header">Components Palette</div>
                        <div style={{flex:1, position:"relative"}}>
                            <div className="absolute-content">
                                <Droppable droppableId="#droppable-sidbar-palette">
                                {(provided, snapshot) => (
                                    <div ref={provided.innerRef}>
                                        {this.props.components.map((item,index)=>(
                                            <DraggablePaletteMenuItem index={index} {...item} key={item._id}/>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                                </Droppable>
                            </div>
                        </div>
                    </div>
                    <div className="main-content">
                        <div className="stepper-container">
                            <Step.Group style={{width:"80%", padding:0}}>
                                <Step  
                                    active={this.state.currentStep === "CONFIGURE_COMPONENT"}
                                    onClick={this.handleMoveToConfigureComp}
                                >
                                    <Icon name='configure' />
                                    <Step.Content>
                                        <Step.Title style={{fontSize:16,}}>
                                            Configure Component
                                        </Step.Title>
                                    </Step.Content>
                                </Step>
                                <Step 
                                    active={this.state.currentStep === "CONFIGURE_EXPERIMENT"}
                                    onClick={this.handleMoveToConfigureExp}>
                                    <Icon name='lab' />
                                    <Step.Content>
                                        <Step.Title style={{fontSize:16}}>Configure Experiment</Step.Title>
                                    </Step.Content>
                                </Step>
                            </Step.Group>
                        </div>
                        <div className="current-display center-content">
                            <div className="absolute-content">
                                <ConfigureComponentView 
                                    componentNodes={this.state.componentNodes}
                                    onRemoveCompConfig={this.handleRemoveComponentConfig}
                                    nodeRefList={this.nodeRefs}
                                    isActive={this.state.currentStep === "CONFIGURE_COMPONENT"}
                                /> 
                                <ConfigureExperimentView 
                                    isActive={this.state.currentStep === "CONFIGURE_EXPERIMENT"}
                                />
                            </div>
                        </div>
                        <div className="content-footer">
                            {this.state.currentStep === "CONFIGURE_COMPONENT" &&
                                <Button size="big" primary onClick={this.handleMoveToConfigureExp}>NEXT <Icon name="arrow right" /> </Button>
                            }
                            {this.state.currentStep === "CONFIGURE_EXPERIMENT" &&
                                <Button size="big" primary onClick={this.handleMoveToConfigureComp}> <Icon name="arrow left" /> BACK </Button>
                            }
                        </div>
                    </div>
                </DragDropContext>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateExperimentScreen);