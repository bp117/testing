import React, {useState} from "react";
import ReactDOM from "react-dom";
import { Button, Step, Icon, Input, Dropdown } from "semantic-ui-react";
import { Switch, Route } from "react-router-dom";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { showWarningNotification, showErrorNotification, confirmationAlert, errorAlert } from "../../components/utils/alerts";
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
                <Button negative onClick={props.onRemove}><Icon name="trash" /> Remove</Button>
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
                                    onRemove={()=>props.onRemoveCompConfig(item)}
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

const KanbanCardItem = (props)=>(
    <div className="kanban-card-container">
        <div className="kanban-card">
            <h4> {props.name} </h4>
        </div>
        <div className="controls">
            <Button.Group>
                <Button icon style={{padding:7}} onClick={props.onEditKanbanItem} color="blue">
                    <Icon name="edit" style={{fontSize:13}} />
                </Button>
                <Button icon style={{padding:7}} onClick={props.onCloneKanbanItem} color="blue">
                    <Icon name="clone" style={{fontSize:12}} />
                </Button>
                <Button icon negative style={{padding:7}} onClick={props.onRemoveKanbanItem}>
                    <Icon name="trash" style={{fontSize:11}} />
                </Button>
            </Button.Group>
        </div>
    </div>
)

const ConfigureExperimentView = (props)=>(
    <div className={"match-parent center-content "+(props.isActive?"":"hidden")}>
        <div className="match-parent configure-exp-container">
            <div style={{display:"flex", alignItems:"center", width:"90%", justifyContent:"center", marginBottom:15}}>
                <span style={{marginRight:10, fontFamily:"Josefin Sans", fontSize:15}}>Experiment Name</span>
                <Input 
                    style={{flex:1}} 
                    size="large" 
                    action={{content:"Create Experiment", color:"green", icon:"check", size:"large", onClick:props.onCreateExperiment}}
                    value={props.experimentName}
                    onChange={(_, data)=>props.onEditExperimentName(data.value)} />
            </div>
            <div className="kanban-boards-container">
                {Object.keys(props.kanbanStates).map(stateName=>(
                    <div className="kanban-board">
                        <div className="header">{stateName}</div>
                        <div className="body">
                            <div className="absolute-content">
                                <Droppable droppableId="#droppable-kanban-board">
                                    {(provided, snapshot) => (
                                        <div ref={provided.innerRef}>
                                            {(props.kanbanStates[stateName]||[]).map((item,index)=>(
                                                <KanbanCardItem 
                                                    {...item} 
                                                    key={getCompId(item)}
                                                    onRemoveKanbanItem={()=>props.onRemoveKanbanItem(item, stateName)}
                                                    onEditKanbanItem={()=>props.onEditKanbanItem(item, stateName)}
                                                    onCloneKanbanItem={()=>props.onCloneKanbanItem(item, stateName)}
                                                /> 
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
    </div>
)

const KanbanComponentEditView = (props)=>{
    let { data } = props;
    const [currentCmd, setCurrentCmd] = useState("start");
    const [commands, setCommands] = useState({
        "start": (data.actions["start"]||{}).command, 
        "stop": (data.actions["stop"]||{}).command, 
        "status": (data.actions["status"]||{}).command
    });
    const [timeouts, setTimeouts] = useState({
        "start": (data.actions["start"]||{}).timeout, 
        "stop": (data.actions["stop"]||{}).timeout, 
        "status": (data.actions["status"]||{}).timeout
    });
    const [actionArgs, setActionArgs] = useState(data.actionArguments||"");
    const [waitTime, setWaitTime] = useState(data.waitTimeInMillsAfterAction||"");
    const [expectedOutput, setExpectedOutput] = useState(data.expectedOutputFunctionForRegex||"");
    return (
        <div style={{padding:10}}>
            <div style={{display:"flex"}}>
                <div style={{flex:1, margin:"0 5px"}}>
                    <div style={{fontSize:12, fontWeight:"bold", color:"#263238"}}>Command</div>
                    <div>
                        <Dropdown
                            placeholder='Select Command'
                            search
                            selection
                            defaultValue="start"
                            options={[
                                {key:"Start", value:"start", text:"Start", style:{fontSize:16}, icon:"play circle"},
                                {key:"Stop", value:"stop", text:"Stop", style:{fontSize:16}, icon:"stop circle"},
                                {key:"Status", value:"status", text:"Status", style:{fontSize:16}, icon:"chart bar"}
                            ]}
                            onChange={(_, cmd)=>{
                                setCurrentCmd(cmd.value);
                                setCommands({...commands, [cmd.value]: (( data.actions[cmd.value] || {} ).command || "" ) });
                                setTimeouts({...timeouts, [cmd.value]: (( data.actions[cmd.value] || {} ).timeout || "0" ) })
                            }}
                        />
                    </div>
                </div>
                <div style={{flex:1, margin:"0 5px"}}>
                    <div style={{fontSize:12, fontWeight:"bold", color:"#263238"}}>Value</div>
                    <div>
                        <Input 
                            placeholder="Enter command value..." 
                            value={commands[currentCmd]}
                            onChange={(_, input)=>{
                                setCommands({...commands, [currentCmd]: input.value })
                                data.actions[currentCmd] && ( data.actions[currentCmd].command = input.value )
                            }}/>
                    </div>
                </div>
                <div style={{flex:1, margin:"0 5px"}}>
                    <div style={{fontSize:12, fontWeight:"bold", color:"#263238"}}>Timeout</div>
                    <div>
                        <Input 
                            placeholder="Timeout value in (ms)"
                            value={timeouts[currentCmd]}
                            error={timeouts[currentCmd] && Number.isNaN( Number(timeouts[currentCmd]) )}
                            onChange={(_, input)=>{
                                setTimeouts({...commands, [currentCmd]: input.value })
                                if(!Number.isNaN( Number(input.value) )){
                                    data.actions[currentCmd] && ( data.actions[currentCmd].timeout = Number(input.value) )
                                }
                            }} />
                    </div>
                </div>
            </div>
            <div style={{display:"flex", paddingTop:10}}>
                <div style={{flex:1, margin:"0 5px"}}>
                    <div style={{fontSize:12, fontWeight:"bold", color:"#263238"}}>Action arguments</div>
                    <div>
                        <Input 
                            placeholder="Enter value..."
                            value={actionArgs}
                            onChange={(_,input)=>{
                                setActionArgs(input.value);
                                data.actionArguments = input.value;
                            }}/>
                    </div>
                </div>
                <div style={{flex:1, margin:"0 5px"}}>
                    <div style={{fontSize:12, fontWeight:"bold", color:"#263238"}}>Wait time after action (ms)</div>
                    <div>
                        <Input 
                            placeholder="Time in milliseconds..."
                            error={waitTime && Number.isNaN( Number(waitTime) )}
                            value={waitTime}
                            onChange={(_,input)=>{
                                setWaitTime(input.value);
                                data.waitTimeInMillsAfterAction = Number( input.value );
                            }}/>
                    </div>
                </div>
                <div style={{flex:1, margin:"0 5px"}}>
                    <div style={{fontSize:12, fontWeight:"bold", color:"#263238"}}>Expected output function for Regex</div>
                    <div>
                        <Input 
                            placeholder="Enter value..."
                            value={expectedOutput}
                            onChange={(_,input)=>{
                                setExpectedOutput(input.value);
                                data.expectedOutputFunctionForRegex = input.value;
                            }}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

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
            kanbanStates:{"Steady State":[], "Chaos State":[], "Rollback State":[]},
            isKanbanEdited: false,
            experimentName: ""
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
            let tempCompName = draggedComp.name;
            confirmationAlert(
                <div style={{display:"flex", alignItems:"center", marginTop:10}}>
                    <span style={{marginRight:10}}>Name:</span>
                    <Input defaultValue={tempCompName} onChange={(elt)=>tempCompName = elt.target.value } />
                </div>,
                ()=>{
                    draggedComp = {...draggedComp, name: tempCompName}
                    if(draggedComp && !this.state.componentNodes.find( item => getCompId(item) === getCompId(draggedComp) )){
                        this.nodeRefs = {...this.nodeRefs, [getCompId(draggedComp)]:React.createRef()}
                        this.setState({componentNodes:[
                            ...this.state.componentNodes, 
                            draggedComp
                        ]});
                    }
                    else if(draggedComp){
                        showWarningNotification(tempCompName+" is already added to the component canvas")
                    }
                },
                {isPositiveBtn:true, okBtnText:"Set Name", cancelBtnText:"Cancel", title:"Edit component name"}
            )
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
    handleRemoveKanbanItem = (component, stateName)=>{
        confirmationAlert("Remove `"+component.name+"` from `"+stateName+"`?", ()=>{
            let kanbanStates = JSON.parse(JSON.stringify(this.state.kanbanStates));
            kanbanStates[stateName] = (kanbanStates[stateName]||[]).filter(item=>getCompId(item)!==getCompId(component))
            this.setState({kanbanStates, isKanbanEdited:true});
        }, {okBtnText:"Yes, Remove"});
    }
    handleCloneKanbanItem = (component, stateName)=>{
        let tempName = component.name+" (copy)";
        confirmationAlert(
            <div style={{display:"flex", alignItems:"center", marginTop:10}}>
                <span style={{marginRight:10}}>Name:</span>
                <Input defaultValue={tempName} onChange={(_, data)=>tempName = data.value} />
            </div>,
            ()=>{
                if(!this.state.kanbanStates[stateName].find(item2=>item2.name===tempName)){
                    let kanbanStates = JSON.parse(JSON.stringify(this.state.kanbanStates));
                    kanbanStates[stateName] = [...kanbanStates[stateName], {...component, name: tempName}]
                    this.setState({kanbanStates, isKanbanEdited:true});
                }else{
                    showWarningNotification("A component with the name `"+tempName+"` already exists in the `"+stateName+"`.")
                }
            },
            {isPositiveBtn:true, okBtnText:"Set Name", cancelBtnText:"Cancel", title:"Change clone component name"}
        )
    }
    handleEditKanbanItem = (component, stateName)=>{
        let mutableEditData = JSON.parse(JSON.stringify(component)); //DATA TO BE EDITED AND SHOULD BE MUTATED FOR THE CHANGES TO TAKE EFFECT
        confirmationAlert(
            <KanbanComponentEditView 
                data={mutableEditData}
                stateName={stateName} 
            />,
            ()=>{
                let kanbanStates = JSON.parse(JSON.stringify(this.state.kanbanStates));
                kanbanStates[stateName] = (kanbanStates[stateName]||[]).map(item=>{
                    if(getCompId(item) === getCompId(component)){
                        item = mutableEditData;
                    }   
                    return item;
                });
                this.setState({kanbanStates, isKanbanEdited:true});
            },
            {title:"Edit "+component.name+" component", okBtnText:"Save Edits", isPositiveBtn:true}
        )
    }
    handleMoveToConfigureExp = ()=>{
        //let allConnections = this.jsPlumb.getAllConnections();
        if(this.state.currentStep !== "CONFIGURE_EXPERIMENT"){
            this._prepareKanbanStates();
            this.setState({currentStep: "CONFIGURE_EXPERIMENT", isKanbanEdited:false})
        }
    }
    handleMoveToConfigureComp = ()=> {
        if(this.state.currentStep === "CONFIGURE_EXPERIMENT" && this.state.isKanbanEdited){
            confirmationAlert("You will loose all your component configurations done in this phase. Proceed?", ()=>{
                this.setState({currentStep: "CONFIGURE_COMPONENT"})
            }, {okBtnText:"Yes, Proceed"})
        }else{
            this.setState({currentStep: "CONFIGURE_COMPONENT"})
        }
    }
    _prepareKanbanStates = ()=>{
        let kanbanStatesData = {} ;
        let states = ["Steady State", "Chaos State", "Rollback State"];
        states.forEach((item)=>{
            let data = JSON.parse(JSON.stringify( this.state.componentNodes )); //This deep cloning method should work fine for our use case
            // let currentData = JSON.parse(JSON.stringify( (this.state.kanbanStates[item]||[]) ));
            // if(currentData){
            //     data = data.filter(item2 => !currentData.some( item3 => getCompId(item3) === getCompId(item2) )); //filter items that have already been added
            //     data = [...currentData, ...data];
            // }
            kanbanStatesData[item] = data;
        });
        
        this.setState({kanbanStates: kanbanStatesData})
    }
    _loadComponentDefinitions = ()=>{
        this.props.getComponentDefinition((success, error)=>{
            if(!success){
                showErrorNotification(`Something went wrong: "${error}"`)
            }
        });
    }
    _generateExperimentJSON = ()=>{
        let jsonData = {type:"Experiment", description:this.state.experimentName, components:[]}
        let addedComponents = []
        Object.keys(this.state.kanbanStates).forEach(kState=>{
            (this.state.kanbanStates[kState]||[]).forEach(item=>{
                let formattedKey = kState.replace(/\s+/g, "");
                formattedKey = formattedKey[0].toLowerCase()+formattedKey.slice(1);
                jsonData[formattedKey] = [...(jsonData[formattedKey]||[]), item];
                if(!addedComponents.includes(item._id)){
                    addedComponents.push(item._id);
                    jsonData.components.push(item);
                }
            })
        });

        return jsonData;
    }
    handleCreateExperiment = ()=>{
        if(!this.state.experimentName.trim()){
            return errorAlert("Experiment name is required");
        }
        let {kanbanStates} = this.state
        if(!Object.keys(kanbanStates).find(kState=>(kanbanStates[kState]||[]).length>0)){
            return errorAlert("No component entries to generate the experiment JSON data");
        }

        let generatedExperimentJson = this._generateExperimentJSON();
        console.log("GENERATED JSON ", generatedExperimentJson);
        //save now to the db
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
                                    kanbanStates={this.state.kanbanStates}
                                    experimentName={this.state.experimentName}
                                    onRemoveKanbanItem={this.handleRemoveKanbanItem}
                                    onEditKanbanItem={this.handleEditKanbanItem}
                                    onCloneKanbanItem={this.handleCloneKanbanItem}
                                    onEditExperimentName={(experimentName)=>this.setState({experimentName})}
                                    onCreateExperiment={this.handleCreateExperiment}
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