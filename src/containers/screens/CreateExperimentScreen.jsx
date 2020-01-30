import React from "react";
import ReactDOM from "react-dom";
import { Button, Step, Icon, Input } from "semantic-ui-react";
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
    <Draggable draggableId={getCompId(props)} index={props.index} isDragDisabled={props.isDragDisabled}>
        {(provided, snapshot) => (
            <React.Fragment>
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
                {snapshot.isDragging &&
                    <PaletteMenuItem {...props} />
                }
            </React.Fragment>
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
                <Button negative onClick={()=>props.onRemove(props)}><Icon name="trash" /> Remove</Button>
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
                                    key={getCompId(item)} 
                                    itemRef={props.nodeRefList[getCompId(item)]} 
                                    onRemove={props.onRemoveCompConfig}
                                    compId={getCompId(item)} />
                            ))}
                        </div>
                    )}
                    </Droppable>
                </div>
            </div>
        </div>
    </div>
)

const SidebarPalette = (props)=>(
    <div className="sidebar-palette">
        <div className="header">Components Palette</div>
        <div style={{flex:1, position:"relative"}}>
            <div className="absolute-content">
                <Droppable droppableId="#droppable-sidbar-palette" isDropDisabled={true}>
                {(provided, snapshot) => (
                    <div ref={provided.innerRef}>
                        {props.components.map((item,index)=>(
                            <DraggablePaletteMenuItem index={index} {...item} key={getCompId(item)} isDragDisabled={props.isDragDisabled}/>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
                </Droppable>
            </div>
        </div>
    </div>
)

const StepperComponent = (props)=>(
    <Step.Group style={{width:"80%", padding:0}}>
        {props.stepperItems.map((item, indx)=>(
            <Step  
                active={item.active}
                onClick={item.onClick}
                key={item.key||""+indx}
            >
                <Icon name={item.icon} />
                <Step.Content>
                    <Step.Title style={{fontSize:16,}}>
                        {item.text}
                    </Step.Title>
                </Step.Content>
            </Step>
        ))
        }
    </Step.Group>
)

const ConfigureExperimentView = (props)=>(
    <div className={"match-parent center-content "+(props.isActive?"":"hidden")}>
        <div className="match-parent configure-exp-container">
            {Object.keys(props.kanbanStates).map(kanbanState=>(
                <div className="kanban-board">
                    <div className="header">{kanbanState}</div>
                    <div className="body">
                        <div className="absolute-content">
                            <Droppable droppableId="#droppable-kanban-board">
                                {(provided, snapshot) => (
                                    <div ref={provided.innerRef}>
                                        {(props.kanbanStates[kanbanState]||[]).map((item,index)=>(
                                            <div>asdsad</div>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
)

const specialChars = "£$%^&*-+=!";
const getCompId = (component)=>{
    return component._id + specialChars + component.name
}

class CreateExperimentScreen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            componentNodes: [],
            currentStep: "CONFIGURE_COMPONENT",
            kanbanStates:{}
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
        if(data.destination && data.destination.droppableId != data.source.droppableId){
            let draggedComp = this.props.components.find(item=>getCompId(item)===data.draggableId);
            this.setState({tempCompName:draggedComp.name}, ()=>{
                confirmationAlert(
                    <div style={{display:"flex", alignItems:"center", marginTop:10}}>
                        <span style={{marginRight:10}}>Name:</span>
                        <Input defaultValue={this.state.tempCompName} onChange={(elt)=>this.setState({tempCompName:elt.target.value})} />
                    </div>,
                    ()=>{
                        draggedComp = {...draggedComp, name: this.state.tempCompName}
                        if(draggedComp && !this.state.componentNodes.find( item => getCompId(item) === getCompId(draggedComp) )){
                            this.nodeRefs = {...this.nodeRefs, [getCompId(draggedComp)]:React.createRef()}
                            this.setState({componentNodes:[
                                ...this.state.componentNodes, 
                                draggedComp
                            ]});
                        }
                        else if(draggedComp){
                            showWarningNotification(draggedComp.name+" is already added to the component canvas")
                        }
                    },
                    {isPositiveBtn:true, okBtnText:"Set Name", cancelBtnText:"Cancel", title:"Edit component name"}
                )
            })
        }
    }
    
    handleRemoveComponentConfig = (component)=>{
        confirmationAlert("Are you sure you want to remove this component?", ()=>{
            let compId = getCompId(component)
            let domNode = ReactDOM.findDOMNode(this.nodeRefs[compId].current)
            this.jsPlumb.remove(domNode)
            delete this.nodeRefs[compId]
            this.setState({componentNodes:this.state.componentNodes.filter(item => getCompId(item) !== getCompId(component))}, ()=>{
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
            let domNode = ReactDOM.findDOMNode(this.nodeRefs[getCompId(node)].current)
            this.jsPlumb.addEndpoint(domNode, {anchor:"RightMiddle"}, {isSource:true, isTarget:true});
        })
    }
    render(){
        return (
            <div className="match-parent create-experiment-screen">
                <DragDropContext onDragEnd={this.handleComponentDropped}>
                    <SidebarPalette components={this.props.components} isDragDisabled={this.state.componentNodes.length>0 && this.state.currentStep === "CONFIGURE_EXPERIMENT"}/>
                    <div className="main-content">
                        <div className="stepper-container">
                            <StepperComponent 
                                stepperItems = {[
                                    {
                                        text:"Configure Component", 
                                        icon:"configure", 
                                        onClick:this.handleMoveToConfigureComp,
                                        active: this.state.currentStep === "CONFIGURE_COMPONENT"
                                    },
                                    {
                                        text:"Configure Experiment", 
                                        icon:"lab", 
                                        onClick:this.handleMoveToConfigureExp,
                                        active: this.state.currentStep === "CONFIGURE_EXPERIMENT"
                                    }
                                ]}
                            />
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
                                    kanbanStates={/*this.state.kanbanStates*/ {"Steady State":[], "Chaos State":[], "Rollback State":[]}}
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