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
            let parsedData = stateData.map(item=>{
                let {name:cName, type:cType} = item.component;
                let comp = expData.environment.components.find(item2=>item2.name === cName && item2.type===cType);
                let hostCount = 0;
                let hosts = comp? comp.environmentConfig.hosts.map(host=>{
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
            return stateData.map(item=>{
                let dep = item.dependencies[0];
                if(dep && dep.direction === "downstream"){
                    return {source:item.name, target:dep.name}
                }
                else if(dep.direction === "upstream"){
                    return {source: dep.name, target:item.name}
                }
            });
        }
        let steadyState = processStateData( expData.experiment.steadyState.executionSteps );
        let chaosState = processStateData( expData.experiment.chaosState.executionSteps );
        let rollbackState = processStateData( expData.experiment.rollbackState.executionSteps );

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
        let pData = this._addStateToProcessedData( this._processData(this.state.experimentConfig), hostStatus )
        let runningIndx = hostStatus.state == "rollback"? 2 : hostStatus.state === "chaos"? 1: hostStatus.state === "steadyState"? 0 : -1
        this.d3Managers.forEach((item, indx)=>item.updateGraph(pData.rollbackState[0], pData.rollbackState[1], runningIndx === indx));

        this.setState({runningState: runningIndx == 0? "Steady State": runningIndx == 1? "Chaos State": runningIndx == 2? "Rollback State": null})
    }
    startFetchingStatus = ()=>{
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
                                <span style={{marginLeft:10, padding:"2px 5px", borderRadius:5, backgroundColor:"#2196F3", fontSize:14}}>running</span>
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
                    <div style={{display:"flex", alignItems:"center"}}>
                        {[{text:"Unknown", color:"rgba(220,220,0,0.5)"}, {text:"Success", color:"rgba(0,220,0,0.5)"}, {text:"Failure", color:"rgba(220,0,0,0.5)"}].map(item=>(
                            <div style={{marginRight:20, display:"flex", alignItems:"center"}}>
                                <span style={{ display:"inline-block", width:25, height:25, borderRadius:"50%", border:"3px solid blue", backgroundColor: item.color}} />
                                <span style={{marginLeft:10}}>{item.text}</span>
                            </div>
                        )) }
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)( RunExperimentStatus )