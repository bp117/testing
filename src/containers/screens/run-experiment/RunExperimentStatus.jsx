import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Header, Segment, Button, Icon, Dropdown, Checkbox, Table } from "semantic-ui-react";
import "./run-exp-styles.scss";
import CustomAccordion from "../../../components/widgets/CustomAccordion";
import * as experimentActions from "../../../actions/experimentActions";
import * as environmentActions from "../../../actions/environmentActions";
import { showErrorNotification, errorAlert, showSuccessNotification } from "../../../components/utils/alerts";
import D3GraphManager from "./d3GraphManager";

function mapStateToProps(state){
    return {
        isFetchingEnvironment: state.environments.isFetchingEnvironment,
        isFetchingExperiment: state.experiments.isFetchingExperiment,
        environments: state.environments.environments,
        experiments: state.experiments.experiments,
        finalExperiments: state.experiments.finalExperiments
    }
}
function mapDispatchToProps(dispatch){
    return bindActionCreators({...experimentActions, ...environmentActions}, dispatch)
}

class RunExperimentStatus extends React.Component{
    constructor(props){
        super(props);
        this.steadyStateRef = React.createRef();
        this.chaosStateRef = React.createRef();
        this.rollbackStateRef = React.createRef();
        this.state = {
        }
    }
    componentWillReceiveProps(props){
        
    }

    _processData = (expData)=>{
        function processStateData(stateData){
            let nodeCount = 0;
            let parsedData = (stateData||[]).map(item=>{
                let {name:cName, type:cType} = item.component;
                let comp = expData.environment.components.find(item2=>item2.name === cName && item2.type===cType);
                let hostCount = 0;
                let hosts = comp? ((comp.environmentConfig||{}).hosts||[]).map(host=>{
                    let hostname = Object.keys(host)[0];
                    let status = "unknown";
                    return ({hostname, status, hostCount: hostCount++});
                }) : []
                return ({
                    name:item.component.name, 
                    type:item.component.type, 
                    action:item.action, 
                    nodeCount: nodeCount++,
                    hosts,
                    dependencies:(item.dependencies||[]).map(item2=>({name:item2.editedName, type:item2.name, direction:item2.direction}))
                })
            });
            return parsedData
        }
        function getStateDependencies(stateData){
            let dependencies = [];
            (stateData||[]).map(item=>{
                (item.dependencies||[]).forEach(dep=>{
                    if(dep && dep.direction === "downstream"){
                        if(!dependencies.find(item2=>item2.source === item.name && item2.target === dep.name)){
                            dependencies.push({source:item.name, target:dep.name})
                        }
                    }
                    else if(dep && dep.direction === "upstream"){
                        if(!dependencies.find(item2=>item2.source === dep.name && item2.target === item.name)){
                            dependencies.push({source: dep.name, target:item.name})
                        }
                    }
                });
            });

            return dependencies
        }
        let steadyState = processStateData( (expData.experiment.steadyState||{}).executionSteps );
        let chaosState = processStateData( (expData.experiment.chaosState||{}).executionSteps );
        let rollbackState = processStateData( (expData.experiment.rollbackState||{}).executionSteps );

        let steadyStateDeps = getStateDependencies( steadyState )
        let chaosStateDeps = getStateDependencies( chaosState )
        let rollbackStateDeps = getStateDependencies( rollbackState )

        return {steadyState:[steadyState, steadyStateDeps], chaosState:[chaosState, chaosStateDeps], rollbackState:[rollbackState, rollbackStateDeps]}
    }

    _addStateToProcessedData = (processedData, logData) =>{
        if(!logData) return processedData;

        Object.keys(processedData).map(key=>{
            processedData[key][0].forEach(item=>{
                if(item.hosts && item.hosts.length>0 && item.name === logData.component){
                    item.hosts.forEach(item2=>{
                        if(item2.hostname.replace(/_/g, ".") === (logData.host||"").replace(/_/g, ".")){
                            item2.status = ""+logData.success === "true"? "success" : ""+logData.success === "false"? "failure" : "unknown"
                        }
                    });
                }
            });
        });
        return processedData
    }

    _drawGraph = (experimentConfig, hostStatus)=>{
        let pData = this._addStateToProcessedData( this._processData(experimentConfig), hostStatus )
        
        let steadyStateNode = ReactDOM.findDOMNode(this.steadyStateRef.current);
        let chaosStateNode = ReactDOM.findDOMNode(this.chaosStateRef.current);
        let rollbackStateNode = ReactDOM.findDOMNode(this.rollbackStateRef.current);
        
        this.d3SteadyStateMgr = new D3GraphManager(steadyStateNode, pData.steadyState[0], pData.steadyState[1]);
        this.d3ChaosStateMgr = new D3GraphManager(chaosStateNode, pData.chaosState[0], pData.chaosState[1]);
        this.d3RollbackStateMgr = new D3GraphManager(rollbackStateNode, pData.rollbackState[0], pData.rollbackState[1]);
        this.d3Managers = [this.d3SteadyStateMgr, this.d3ChaosStateMgr, this.d3RollbackStateMgr];
        this.d3Managers.forEach(item=>item.drawGraph())
    }
    _updateGraph = (hostStatus)=>{
        hostStatus = hostStatus || {}
        if(hostStatus.host === "EXPERIMENT END" || hostStatus.state === "END"){
            this.stopFetchingStatus();
            this.setState({runningState:"END"}, ()=>{
                showSuccessNotification("Experiment Complete!");
            })
        }else{
            let pData = this._addStateToProcessedData( this._processData(this.state.experimentConfig), hostStatus )
            let runningState = hostStatus.state == "rollback"? "Rollback State" : hostStatus.state === "chaos"? "Chaos State": hostStatus.state === "steadyState"? "Steady State" : null
            this.d3SteadyStateMgr.updateGraph(pData.steadyState[0], pData.steadyState[1], hostStatus.state === "steadyState");
            this.d3ChaosStateMgr.updateGraph(pData.chaosState[0], pData.chaosState[1], hostStatus.state === "chaos");
            this.d3RollbackStateMgr.updateGraph(pData.rollbackState[0], pData.rollbackState[1], hostStatus.state == "rollback");
    
            this.setState({runningState})
        }
    }
    startFetchingStatus = ()=>{
        //WE RUN IT ONCE, FIRST
        this.props.getExperimentStatus(this.state.experimentId, (success, status)=>{
            if(success){
                this._updateGraph(status.status);
            }
        });

        //THEN SET AN INTERVAL TO CONTINOUSLY RUN IT.
        if(!this.fetchStatusIntvId){
            this.fetchStatusIntvId = setInterval(() => {
                if(!this.isFetching) {
                    this.isFetching = true
                    this.props.getExperimentStatus(this.state.experimentId, (success, status)=>{
                        this.isFetching = false;
                        if(success){
                            this._updateGraph(status.status);
                        }else{
                            // Something is not going right !
                        }
                    });
                }
            }, 5000);
        }
    }
    stopFetchingStatus = ()=> {
        if(this.fetchStatusIntvId)
            clearInterval(this.fetchStatusIntvId)
    }
    componentDidMount(){
        let graphData = this.props.location.state;
        if(graphData && graphData.config && graphData.experimentId){
            this.setState({
                experimentConfig: graphData.config,
                experimentId: graphData.experimentId
            }, ()=>{
                this.startFetchingStatus()
            });
            this._drawGraph(graphData.config, null)
        } else {
            showErrorNotification("could not find experiment data or experiment id to initiate the DAG network");
        }
    }
    componentWillUnmount(){
        this.stopFetchingStatus()
    }
    render(){
        return (
            <div className="match-parent experiment-execution" style={{padding:10}}>
                <div className="header"></div>
                <div className="experiment-container">
                    {[  {state:"Steady State", ref:this.steadyStateRef}, 
                        {state:"Chaos State", ref:this.chaosStateRef}, 
                        {state:"Rollback State", ref:this.rollbackStateRef}
                    ].map(item=>(
                        <div className="lane">
                            <div className="lane-title">{item.state}
                            {item.state === this.state.runningState &&
                                <div className="pulse-effect-view">
                                    <span className="pulse-effect-ind"></span>
                                </div>
                            }
                            </div>
                            <div className="svg-container">
                                <div className="absolute-content">
                                    <div className="match-parent" ref={item.ref}/>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="footer" style={{borderTop:"2px solid #ccc", paddingTop:10}}>
                    <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", padding:"2px 10px"}}>
                        <div style={{display:"flex"}}>
                            {[{text:"Unknown", color:"rgba(220,220,0,0.5)"}, {text:"Success", color:"rgba(0,220,0,0.5)"}, {text:"Failure", color:"rgba(220,0,0,0.5)"}].map(item=>(
                                <div style={{marginRight:20, display:"flex", alignItems:"center"}}>
                                    <span style={{ display:"inline-block", width:25, height:25, borderRadius:"50%", border:"3px solid blue", backgroundColor: item.color}} />
                                    <span style={{marginLeft:10}}>{item.text}</span>
                                </div>
                            ))}
                        </div>
                        <div>
                            {this.state.runningState !== "END" ?
                                <>
                                    <span style={{color:"#212121"}}>Current State:</span>
                                    <span style={{color:"#1E88E5", fontSize:16, fontWeight:"bold", marginLeft:5}}>{this.state.runningState||"Loading..."}</span>
                                </>
                                :
                                <span style={{color:"#00C853", fontSize:16, fontWeight:"bold"}}><Icon name="check circle" style={{fontSize:18}}/> EXPERIMENT COMPLETED</span>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)( RunExperimentStatus )