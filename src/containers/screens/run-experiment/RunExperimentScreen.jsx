import React from "react";
import Stepper from 'react-stepper-horizontal';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Header, Segment, Button, Icon, Dropdown, Checkbox } from "semantic-ui-react";
import "./run-exp-styles.scss";
import CustomAccordion from "../../../components/widgets/CustomAccordion";
import * as experimentActions from "../../../actions/experimentActions";
import * as environmentActions from "../../../actions/environmentActions";
import { showErrorNotification, errorAlert } from "../../../components/utils/alerts";

function mapStateToProps(state){
    return {
        isFetchingEnvironment: state.environments.isFetchingEnvironment,
        isFetchingExperiment: state.experiments.isFetchingExperiment,
        environments: state.environments.environments,
        experiments: state.experiments.experiments
    }
}
function mapDispatchToProps(dispatch){
    return bindActionCreators({...experimentActions, ...environmentActions}, dispatch)
}

const AccordionContent = (props)=>{
    let {data} = props;
    return (
        <div style={{display:"flex", flexWrap:"wrap", padding:"0 15px"}}>
            {data.hosts.map(item=>(
                <div style={{margin:"5px 10px"}}>
                    <Checkbox label={Object.keys(item)[0]} style={{fontSize:16}}/>
                </div>
            ))}
        </div>
    )
}

class RunExperimentScreen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            experimentComponents:[],
            isExperimentValidated: false,
            selectedExperiment: null,
            selectedEnvironment: null
        }
    }
    _loadEnvironmentConfigs = ()=>{
        this.props.fetchEnvironmentConfig((success, error)=>{
            if(!success){
                showErrorNotification(`Something went wrong: "${error}"`)
            }
        });
    }
    _loadExperimentConfigs = ()=>{
        this.props.fetchExperimentJSON((success, error)=>{
            if(!success){
                showErrorNotification(`Something went wrong: "${error}"`)
            }
        })
    }
    validateExperiment = ()=>{
        let components = this.state.selectedExperiment.components;
        let {selectedEnvironment} = this.state;
        let envComponents = (selectedEnvironment||{}).components;
        if(!components || components.length==0){
            errorAlert("There are no components for the selected experiment");
        }else if(!envComponents || envComponents.length==0){
            errorAlert("No components found in the selected environment config")
        } else{
            let noHostsComps = components.filter(item=>!envComponents.some(item2=>{
                return (item2.name===item.name && item2.environmentConfig && 
                        item2.environmentConfig.hosts && item2.environmentConfig.hosts.length>0)
            }));
            if(noHostsComps.length>0){
                errorAlert(`No host available for: ${noHostsComps.map(t=>t.name).join(", ")}`)
            }else{
                this.setState({
                    experimentComponents: components.map( item=>({
                        ...item, 
                        hosts:envComponents.find(item2=>item2.name===item.name).environmentConfig.hosts
                    })), 
                    isExperimentValidated:true
                });
            }
        }
    }
    componentDidMount(){
        this._loadEnvironmentConfigs();
        this._loadExperimentConfigs()
    }
    render(){
        return (
            <div className="match-parent" style={{padding:10}}>
                <Segment className="match-parent run-experiment">
                    <div className="header">Run the experiment</div>
                    <div className="body">
                        <div className="main-content">
                            <div className="stepper-container">
                                <Stepper 
                                    steps={ [{title: 'Validate Experiment'}, {title: 'Run Experiment'}] } activeStep={ 1 } />
                            </div>
                            <div className="experiment-setup-form">
                                <div className="item">
                                    <Dropdown fluid selection
                                        placeholder="Select Experiment..."
                                        loading={this.props.isFetchingExperiment} 
                                        options={this.props.experiments.map(item=>({
                                            key: item._id,
                                            value:item,
                                            text: item.description,
                                            style:{fontSize:16}
                                        }))}
                                        onChange={(_, data)=>{
                                            this.setState({selectedExperiment:data.value})
                                        }}/>
                                </div>
                                <div className="item">
                                    <Dropdown selection fluid
                                        placeholder="Select Environment..."
                                        loading={this.props.isFetchingEnvironment} 
                                        options={this.props.environments.map(item=>({
                                            key: item._id,
                                            value: item,
                                            text: item.name,
                                            style:{fontSize:16}
                                        }))}
                                        onChange={(_, data)=>{
                                            this.setState({selectedEnvironment:data.value})
                                        }}
                                    />
                                </div>
                                <div className="item">
                                    <Button 
                                        style={{height:"100%", fontSize:14}} 
                                        color="teal" 
                                        disabled={!this.state.selectedExperiment || !this.state.selectedEnvironment}
                                        onClick={this.validateExperiment}>
                                        VALIDATE EXPERIMENT
                                    </Button>
                                </div>
                            </div>
                            {this.state.isExperimentValidated &&
                                <div className="configure-env-container">
                                    <div className="title">Configure the environment and experiment</div>
                                    <div className="accordion-container">
                                        <CustomAccordion panels={this.state.experimentComponents.map(item=>({
                                            key: item._id,
                                            header: item.name,
                                            content: <AccordionContent data={item}/>
                                        }))} />
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="controls">
                        <Button size="big"><Icon name="arrow left" /> Back</Button>
                        <Button size="big">Next <Icon name="arrow right" /></Button>
                    </div>
                </Segment>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)( RunExperimentScreen )