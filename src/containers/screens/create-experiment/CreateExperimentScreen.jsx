import React, {useState} from "react";
import ReactDOM from "react-dom";
import { Button, Step, Icon, Input, Dropdown } from "semantic-ui-react";
import { Switch, Route } from "react-router-dom";
import {jsPlumb} from "jsplumb"
import { connect } from "react-redux";
import {bindActionCreators} from "redux";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { showWarningNotification, showErrorNotification, confirmationAlert, errorAlert, showSuccessNotification } from "../../../components/utils/alerts";
import * as actions from "../../../actions/componentActions";
import * as actions2 from "../../../actions/experimentActions";
import {arrayMove, isValidNumber} from "../../../utils/misc";

function mapStateToProps(state){
    return {
        components: state.components.components
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({...actions, ...actions2}, dispatch);
}


const DraggablePaletteMenuItem = (props)=>(
    <Draggable draggableId={getCompId(props)} index={props.index} isDragDisabled={props.isDragDisabled}>
        {(provided, snapshot) => (
            <React.Fragment>
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
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
            <div className="configure-comp-item" ref={props.itemRef} id={props.compId}>
                <h4>{props.editedName}</h4>
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
                    <Droppable droppableId="#canvas-droppable">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={{ backgroundColor: snapshot.isDraggingOver && "#ECEFF1" }}
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
                <Droppable droppableId="#palette-droppable" isDropDisabled={true}>
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
            <h4> {props.editedName} </h4>
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

const DraggableKanbanCardItem = (props)=>(
    <Draggable draggableId={getCompId(props)+"--->"+props.stateName} index={props.index}>
        {(provided, snapshot) => (
            <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
            >
                <KanbanCardItem {...props}/>
            </div>
        )}
    </Draggable>
)

const ConfigureExperimentView = (props)=>(
    <div className={"match-parent center-content "+(props.isActive?"":"hidden")}>
        <div className="match-parent configure-exp-container">
            <div style={{display:"flex", alignItems:"center", width:"90%", justifyContent:"center", marginBottom:15}}>
                <span style={{marginRight:10, fontFamily:"Josefin Sans", fontSize:15}}>Experiment Name</span>
                <Input 
                    style={{flex:1}} 
                    size="large" 
                    action={{content:"Create Experiment", color:"green", icon:"check", size:"large", onClick:props.onCreateExperiment, loading:props.isSubmitting}}
                    value={props.experimentName}
                    onChange={(_, data)=>props.onEditExperimentName(data.value)} />
            </div>
            <div className="kanban-boards-container">
                {Object.keys(props.kanbanStates).map(stateName=>(
                    <div className="kanban-board" key={stateName}>
                        <div className="header">{stateName}</div>
                        <div className="body">
                            <div className="absolute-content">
                                <Droppable droppableId={"#kanban-droppable--->"+stateName}>
                                    {(provided, snapshot) => (
                                        <div ref={provided.innerRef} className="match-parent" style={{backgroundColor:snapshot.isDraggingOver?"#E8EAF6":null}}>
                                            {(props.kanbanStates[stateName]||[]).map((item,index)=>(
                                                <DraggableKanbanCardItem 
                                                    {...item} 
                                                    key={getCompId(item)}
                                                    index={index}
                                                    stateName={stateName}
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
    const [currentCmd, setCurrentCmd] = useState(data.selectedAction||"start");
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
    const [expectedOutputFn, setExpectedOutputFn] = useState(data.expectedOutputFunctionForRegex||"");
    const [expectedOutcomeStatus, setExpectedOutcomeStatus] = useState(data.expectedOutcomeStatusCode||"");
    const [selectionCriteria, setSelectionCriteria] = useState(data.hostSelectionCriteria||"");
    const [selectionCriteriaCount, setSelectionCriteriaCount] = useState(data.hostSelectionCriteriaCount||"");
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
                            defaultValue={currentCmd}
                            options={[
                                {key:"Start", value:"start", text:"Start", style:{fontSize:16}, icon:"play circle"},
                                {key:"Stop", value:"stop", text:"Stop", style:{fontSize:16}, icon:"stop circle"},
                                {key:"Status", value:"status", text:"Status", style:{fontSize:16}, icon:"chart bar"}
                            ]}
                            onChange={(_, cmd)=>{
                                data.selectedAction = cmd.value
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
                            error={!commands[currentCmd]}
                            onChange={(_, input)=>{
                                data.selectedAction = currentCmd;
                                data.actions[currentCmd] && ( data.actions[currentCmd].command = input.value )
                                setCommands({...commands, [currentCmd]: input.value })
                            }}/>
                    </div>
                </div>
                <div style={{flex:1, margin:"0 5px"}}>
                    <div style={{fontSize:12, fontWeight:"bold", color:"#263238"}}>Timeout</div>
                    <div>
                        <Input 
                            placeholder="Timeout value in (ms)"
                            value={timeouts[currentCmd]}
                            error={!timeouts[currentCmd] || timeouts[currentCmd] && Number.isNaN( Number(timeouts[currentCmd]) )}
                            onChange={(_, input)=>{
                                if(!Number.isNaN( Number(input.value) )){
                                    data.actions[currentCmd] && ( data.actions[currentCmd].timeout = Number(input.value) );
                                }
                                setTimeouts({...commands, [currentCmd]: input.value })
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
                            error={props.checkEdited(currentCmd, data) && !actionArgs}
                            onChange={(_,input)=>{
                                data.actionArguments = input.value;
                                setActionArgs(input.value);
                            }}/>
                    </div>
                </div>
                <div style={{flex:1, margin:"0 5px"}}>
                    <div style={{fontSize:12, fontWeight:"bold", color:"#263238"}}>Wait time after action (ms)</div>
                    <div>
                        <Input 
                            placeholder="Time in milliseconds..."
                            error={props.checkEdited(currentCmd, data) && !waitTime || waitTime && Number.isNaN( Number(waitTime) )}
                            value={waitTime}
                            onChange={(_,input)=>{
                                if(!Number.isNaN( Number(input.value) )){
                                    data.waitTimeInMillsAfterAction = Number( input.value );
                                }
                                setWaitTime(input.value);
                            }}/>
                    </div>
                </div>
                <div style={{flex:1, margin:"0 5px"}}>
                    <div style={{fontSize:12, fontWeight:"bold", color:"#263238"}}>Expected output function for Regex</div>
                    <div>
                        <Input 
                            placeholder="Enter value..."
                            value={expectedOutputFn}
                            error={props.checkEdited(currentCmd, data) && !expectedOutputFn}
                            onChange={(_,input)=>{
                                data.expectedOutputFunctionForRegex = input.value;
                                setExpectedOutputFn(input.value);
                            }}/>
                    </div>
                </div>
            </div>

            <div style={{display:"flex", paddingTop:10}}>
                <div style={{flex:1, margin:"0 5px"}}>
                    <div style={{fontSize:12, fontWeight:"bold", color:"#263238"}}>Expected outcome status code</div>
                    <div>
                        <Input 
                            placeholder="Enter value..."
                            value={expectedOutcomeStatus}
                            error={props.checkEdited(currentCmd, data) && !expectedOutcomeStatus || expectedOutcomeStatus && Number.isNaN( Number(expectedOutcomeStatus) )}
                            onChange={(_,input)=>{
                                if(!Number.isNaN( Number(input.value) )){
                                    data.expectedOutcomeStatusCode = Number(input.value)
                                }
                                setExpectedOutcomeStatus(input.value);
                            }}/>
                    </div>
                </div>
                <div style={{flex:1, margin:"0 5px"}}>
                    <div style={{fontSize:12, fontWeight:"bold", color:"#263238"}}>Host selection criteria</div>
                    <div>
                        <Dropdown 
                            selection
                            placeholder="Host selection criteria..."
                            options={[{key:"all", value:"all", text:"All", style:{fontSize:16}}, {key:"any", value:"any", text:"Any", style:{fontSize:16}}]}
                            value={selectionCriteria}
                            error={props.checkEdited(currentCmd, data) && !selectionCriteria}
                            onChange={(_,input)=>{
                                data.hostSelectionCriteria = input.value;
                                setSelectionCriteria(input.value);
                            }}/>
                    </div>
                </div>
                <div style={{flex:1, margin:"0 5px"}}>
                    {selectionCriteria === "any"&&
                        <React.Fragment>
                            <div style={{fontSize:12, fontWeight:"bold", color:"#263238"}}>Number</div>
                            <div>
                                <Input 
                                    placeholder="Number"
                                    error={props.checkEdited(currentCmd, data) && !selectionCriteriaCount || selectionCriteriaCount && Number.isNaN( Number(selectionCriteriaCount) )}
                                    value={selectionCriteriaCount}
                                    onChange={(_,input)=>{
                                        if(!Number.isNaN( Number(input.value) )){
                                            data.hostSelectionCriteriaCount = Number( input.value );
                                        }
                                        setSelectionCriteriaCount(input.value);
                                    }}/>
                            </div>
                        </React.Fragment>
                    }
                </div>
            </div>
        </div>
    )
}

const specialChars = "£$%^&*-+=!";
const getCompId = (component)=>{
    return component._id + specialChars + component.name+" "+component.editedName
}

class CreateExperimentScreen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            componentNodes: [],
            currentStep: "CONFIGURE_COMPONENT",
            kanbanStates:{"Steady State":[], "Chaos State":[], "Rollback State":[]},
            isKanbanEdited: false,
            experimentName: "",
            isSubmittingExpJson:false,
            isSubmittingDeps: false,
            isDepsSubmitted: false 
        }
        this.nodeRefs = {}
        this.jsPlumb = jsPlumb.getInstance({
            PaintStyle:{ 
              strokeWidth:7, 
              stroke:"#BF360C"
            },
            ConnectionOverlays: [["Arrow", {location: 0.8, width:22, length:22, fill: "#3E2723"}]],
            Connector:[ "Bezier", { curviness: 100 } ],
            Endpoint:[ "Dot", { radius:10 } ],
            EndpointStyle : { fill: "#3E2723"  },
            Anchor : [ "Continuous", {} ]
        });
        this.jsPlumb.bind("beforeDetach", ()=>{
            return confirm("Detach this connection link?")
        });
        this.jsPlumb.bind("connection", (data)=>{
            data.connection.bind("dblclick", ()=>{
                this.jsPlumb.deleteConnection(data.connection);
            })
        })
    }

    _handleKanbanComponentDropped = (data)=>{
        if (data.destination && data.source){
            let sourceIndx = data.source.index;
            let destIndx = data.destination.index;
            let draggedCompId = data.draggableId.substring(0, data.draggableId.lastIndexOf("--->"));
            let kStateSrc = data.draggableId.substring(data.draggableId.lastIndexOf("--->")+4);
            let t = data.destination.droppableId;
            let kStateDest = t.substring(t.lastIndexOf("--->")+4);
            let draggedComp = (this.state.kanbanStates[kStateSrc]||[]).find(item=>getCompId(item)===draggedCompId);
            let mutableKanbanStates = JSON.parse( JSON.stringify(this.state.kanbanStates) );
            let kStateDestArr = mutableKanbanStates[kStateDest];
            let kStateSrcArr = mutableKanbanStates[kStateSrc];
            
            if(kStateSrc === kStateDest){
                arrayMove(kStateDestArr, sourceIndx, destIndx, true)
                this.setState({kanbanStates:mutableKanbanStates})
            }else{
                const moveKanbanCards = (draggedComp)=>{
                    kStateDestArr.splice(destIndx, 0, draggedComp);
                    kStateSrcArr.splice(sourceIndx, 1);
                    this.setState({kanbanStates:mutableKanbanStates})
                }
                if(kStateDestArr.find(item=>item.editedName===draggedComp.editedName)){
                    let tempName = draggedComp.editedName;
                    confirmationAlert(
                        <div style={{display:"flex", alignItems:"center", marginTop:10}}>
                            <span style={{marginRight:10}}>Name:</span>
                            <Input defaultValue={tempName} onChange={(_, data)=>tempName = data.value} autoFocus/>
                        </div>,
                        ()=>{
                            if(!kStateDestArr.find(item2=>item2.editedName===tempName)){
                                moveKanbanCards({...draggedComp, editedName:tempName})
                            }else{
                                showWarningNotification("A component with the name `"+tempName+"` already exists in the `"+kStateDest+"`. So, operation cancelled")
                            }
                        },
                        {isPositiveBtn:true, okBtnText:"Set Name", cancelBtnText:"Cancel", title:"Change name to avoid conflicts"}
                    )
                }
                else moveKanbanCards(draggedComp);
                
                
            }
        }
    }

    handleComponentDropped = (data)=>{
        if(data.source.droppableId.startsWith("#kanban-droppable")){
            this._handleKanbanComponentDropped(data)
        }
        else if (data.destination && data.destination.droppableId != data.source.droppableId){
            let draggedComp = this.props.components.find(item=>getCompId(item)===data.draggableId);
            let tempCompName = draggedComp.name;
            confirmationAlert(
                <div style={{display:"flex", alignItems:"center", marginTop:10}}>
                    <span style={{marginRight:10}}>Name:</span>
                    <Input defaultValue={tempCompName} onChange={(elt)=>tempCompName = elt.target.value } autoFocus/>
                </div>,
                ()=>{
                    draggedComp = {...draggedComp, editedName: tempCompName}
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
        confirmationAlert("Remove `"+component.editedName+"` from `"+stateName+"`?", ()=>{
            let kanbanStates = JSON.parse(JSON.stringify(this.state.kanbanStates));
            kanbanStates[stateName] = (kanbanStates[stateName]||[]).filter(item=>getCompId(item)!==getCompId(component))
            this.setState({kanbanStates, isKanbanEdited:true});
        }, {okBtnText:"Yes, Remove"});
    }
    handleCloneKanbanItem = (component, stateName)=>{
        let tempName = component.editedName+" (copy)";
        confirmationAlert(
            <div style={{display:"flex", alignItems:"center", marginTop:10}}>
                <span style={{marginRight:10}}>Name:</span>
                <Input defaultValue={tempName} onChange={(_, data)=>tempName = data.value} autoFocus/>
            </div>,
            ()=>{
                if(!this.state.kanbanStates[stateName].find(item2=>item2.editedName===tempName)){
                    let kanbanStates = JSON.parse(JSON.stringify(this.state.kanbanStates));
                    kanbanStates[stateName] = [...kanbanStates[stateName], {...component, editedName: tempName}]
                    this.setState({kanbanStates, isKanbanEdited:true});
                }else{
                    showWarningNotification("A component with the name `"+tempName+"` already exists in the `"+stateName+"`.")
                }
            },
            {isPositiveBtn:true, okBtnText:"Set Name", cancelBtnText:"Cancel", title:"Change clone component name"}
        )
    }
    _validateExperimentConfigComp = (compData)=>{
        let originalItem = this.state.componentNodes.find(item=>item._id === compData._id);
        let selectedAction = compData.selectedAction, actionsModified = compData.actions, actions = originalItem.actions; 
        let isActionEdited = selectedAction && (actionsModified[ selectedAction ].command||"").trim() !== (actions[ selectedAction ].command||"").trim()
        if(isActionEdited){
            let errStr = "";
            if(!(actionsModified[selectedAction].command||"").trim()) errStr+="commandValue\r\n";
            if(!(""+actionsModified[selectedAction].timeout).trim()) errStr+="timeout\r\n";
            if(!(compData.actionArguments||"").trim()) errStr+="actionArguments\r\n";
            if(!isValidNumber( compData.waitTimeInMillsAfterAction)) errStr+="waitTimeInMillsAfterAction\r\n";
            if(!(compData.expectedOutputFunctionForRegex||"").trim()) errStr+="expectedOutputFunctionForRegex\r\n";
            if(!isValidNumber(compData.expectedOutcomeStatusCode)) errStr+="expectedOutcomeStatusCode\r\n";
            if(!(compData.hostSelectionCriteria||"").trim()) errStr+="hostSelectionCriteriaCount\r\n";
            if((compData.hostSelectionCriteria||"").trim() && compData.hostSelectionCriteria=="any" && !isValidNumber(compData.hostSelectionCriteriaCount)) errStr+="hostSelectionCriteriaCount\r\n";

            return errStr? errStr.trim().split("\r\n").filter(item=>item.trim()) : null;
        }
        return null
    }
    _checkIfExperimentConfigCompIsEdited = (actionType, compData)=>{
        let originalItem = this.state.componentNodes.find(item=>item._id === compData._id);
        let actionsModified = compData.actions, actions = originalItem.actions; 
        return actionType && (actionsModified[ actionType ].command||"").trim() !== (actions[ actionType ].command||"").trim()
    }
    handleEditKanbanItem = (component, stateName)=>{
        this.setState({editCompHasErrors:false})
        let mutableEditData = JSON.parse(JSON.stringify(component)); //DATA TO BE EDITED AND SHOULD BE MUTATED FOR THE CHANGES TO TAKE EFFECT
        confirmationAlert(
            <KanbanComponentEditView 
                data={mutableEditData}
                stateName={stateName} 
                checkEdited={this._checkIfExperimentConfigCompIsEdited}
            />,
            (onClosCb, setExtraView)=>{
                let valResult = this._validateExperimentConfigComp(mutableEditData)
                if(!valResult || valResult.length==0){
                    let kanbanStates = JSON.parse(JSON.stringify(this.state.kanbanStates));
                    kanbanStates[stateName] = (kanbanStates[stateName]||[]).map(item=>{
                        if(getCompId(item) === getCompId(component)){
                            item = mutableEditData;
                        }   
                        return item;
                    });
                    this.setState({kanbanStates, isKanbanEdited:true});
                    onClosCb();
                }else{
                    errorAlert("Please fill in valid inputs to all required fields", ()=>{
                        this.handleEditKanbanItem(mutableEditData, stateName)
                    });
                }
            },
            {title:"Edit "+component.editedName+" component", okBtnText:"Save Edits", isPositiveBtn:true, cancelBtnText:"Cancel", autoClose:false}
        )
    }
    handleMoveToConfigureExp = ()=>{
        //let allConnections = this.jsPlumb.getAllConnections();
        if(this.state.currentStep !== "CONFIGURE_EXPERIMENT"){
            if(!this.state.isDepsSubmitted && (this.jsPlumb.getAllConnections()||[]).length > 0){
                confirmationAlert("You have not yet saved this dependencies. Do you want to save it now?", ()=> {
                    this.handleSaveDependencies(()=>{
                        this._prepareKanbanStates();
                        this.setState({currentStep: "CONFIGURE_EXPERIMENT", isKanbanEdited:false})
                    });
                }, {okBtnText:"YES, SAVE AND CONTINUE", cancelBtnText:"DON'T SAVE"}, ()=>{
                    this._prepareKanbanStates();
                    this.setState({currentStep: "CONFIGURE_EXPERIMENT", isKanbanEdited:false})
                });
            }else{
                this._prepareKanbanStates();
                this.setState({currentStep: "CONFIGURE_EXPERIMENT", isKanbanEdited:false})
            }
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
                let {name, actions:actionsModified, editedName, selectedAction, waitTimeInMillsAfterAction, actionArguments, expectedOutputFunctionForRegex, expectedOutcomeStatusCode, hostSelectionCriteria, hostSelectionCriteriaCount} = item;
                let originalItem = this.state.componentNodes.find(item2=>item2._id === item._id);
                let {configuration, actions, dependencies} = originalItem
                let compData = {
                    component:{
                        type: name,
                        name: editedName,
                        ...( selectedAction && (actionsModified[ selectedAction ].command||"").trim() !== (actions[ selectedAction ].command||"").trim() ? 
                            { configuration: { [ selectedAction ]: actionsModified[ selectedAction ] } }:{})
                    },
                    action: selectedAction || "start",
                    actionArguments: actionArguments && actionArguments.split(","),
                    waitTimeInMillsAfterAction,
                    expectedOutputFunctionForRegex,
                    expectedOutcomeStatusCode,
                    dependencies,
                    hostSelectionCriteria: hostSelectionCriteria && hostSelectionCriteria === "all"? "all" : "any("+hostSelectionCriteriaCount+")"
                }
                jsonData[formattedKey] = jsonData[formattedKey] || { executionSteps:[] };
                jsonData[formattedKey].executionSteps.push( JSON.parse(JSON.stringify(compData))); //So that all `undefined` fields will be removed

                if(!addedComponents.includes(item.editedName)){
                    addedComponents.push(item.editedName);
                    jsonData.components.push({type:name, name:editedName, configuration, actions, dependencies});
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
        this.setState({isSubmittingExpJson:true},()=>{
            let generatedExperimentJson = this._generateExperimentJSON();
            this.props.submitExperimentJSON(generatedExperimentJson, (success, error)=>{
                if(success){
                    showSuccessNotification("Experiment JSON data was successfully submitted");
                }else{
                    showErrorNotification(`Something went wrong: ${error}`)
                }
                this.setState({isSubmittingExpJson:false});
            })
        })
    }
    handleSaveDependencies = (cb=()=>{})=>{
        let allConnections = this.jsPlumb.getAllConnections();
        let dataToSend = []
        this.setState({isSubmittingDeps:true})
        this.state.componentNodes.forEach(component=>{
            let compDependencyJSON = {...component, dependencies:[]};
            (allConnections||[]).forEach(connection=>{
                if(connection.source.id === getCompId(component)){
                    compDependencyJSON.dependencies.push({...this.state.componentNodes.find(item=>getCompId(item)===connection.target.id), direction:"downstream"})
                }
                else if(connection.target.id === getCompId(component)){
                    compDependencyJSON.dependencies.push({...this.state.componentNodes.find(item=>getCompId(item)===connection.source.id), direction:"upstream"})
                }
            });

            dataToSend.push(compDependencyJSON)
            this.setState({componentNodes:dataToSend});
        });
        if(dataToSend.length>0){
            this.props.submitCompDependencyData(dataToSend, (success, error)=>{
                this.setState({isSubmittingDeps:false})
                if(success){
                    this.setState({isDepsSubmitted:true})
                    typeof cb ==="function" && cb();
                    showSuccessNotification("Component dependencies successfully saved");
                } else if(this.state.isSubmittingDeps){
                    showErrorNotification(`Something went wrong: ${error}`)
                }
            });
            setTimeout(() => {
                if(this.state.isSubmittingDeps){
                    showErrorNotification("No response from server within 1 minute");
                    this.setState({isSubmittingDeps:false})
                }
            }, 60000);
        }else this.setState({isSubmittingDeps:false})
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
                                    isSubmitting = {this.state.isSubmittingExpJson}
                                />
                            </div>
                        </div>
                        <div className="content-footer">
                            {this.state.currentStep === "CONFIGURE_COMPONENT" &&
                                <Button size="big" color="teal" onClick={this.handleSaveDependencies} style={{marginLeft:10}} loading={this.state.isSubmittingDeps}> <Icon name="save" /> Save Dependencies </Button>
                            }
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