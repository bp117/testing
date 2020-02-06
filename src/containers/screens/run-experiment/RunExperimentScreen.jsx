import React from "react";
import Stepper from 'react-stepper-horizontal';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Header, Segment, Button, Icon, Dropdown, Checkbox, Table } from "semantic-ui-react";
import "./run-exp-styles.scss";
import CustomAccordion from "../../../components/widgets/CustomAccordion";
import * as experimentActions from "../../../actions/experimentActions";
import * as environmentActions from "../../../actions/environmentActions";
import { showErrorNotification, errorAlert, showSuccessNotification } from "../../../components/utils/alerts";
import { RUN_EXPERIMENT_STATUS_ROUTE } from "../../../constants/app_routes";

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

const AccordionContent = (props)=>{
    let {data} = props;
    return (
        <div>
            <div style={{fontWeight:"bold", marginBottom:5, fontSize:14, textDecoration:"underline"}}>Hosts</div>
            {data.hosts.map((item,indx)=>(
                <div style={{margin:"5px 10px"}} key={Object.keys(item)[0]+""+indx}>
                    <Checkbox 
                        checked={!!(props.selectedHosts[data.name]||[]).find(item2=>Object.keys(item)[0]===Object.keys(item2)[0])} 
                        label={Object.keys(item)[0].replace(/\_/g, ".")} 
                        style={{fontSize:16}} 
                        onChange={(_, d)=>{
                        props.toggleHostSelection(item, data, d.checked)
                    }}/>
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
            selectedEnvironment: null,
            selectedHosts: {},
            currentStep: "CONFIGURE_ENV"
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
                showErrorNotification(`Something went wrong while fetching the experiment json: "${error}"`)
            }
        });

        this.props.fetchFinalExperimentJSON((success, error)=>{
            if(!success){
                showErrorNotification(`Something went wrong while fetching the final experiment json data: "${error}"`)
            }
        })
    }
    _generateFinalExpJSON = ()=>{
        if(this.state.selectedEnvironment && this.state.selectedExperiment){
            let jsonData = {environment:{ ...this.state.selectedEnvironment }, experiment:{ ...this.state.selectedExperiment }};
            let newComponents = jsonData.environment.components.map(item=>{
                item.environmentConfig.hosts = this.state.selectedHosts[item.name];
                return item;
            });
            jsonData.environment.components = newComponents;
            return jsonData;
        }
        return null;
    }
    handleToggleSelectHost = (host, component, isChecked)=> {
        let compHosts = this.state.selectedHosts[component.name] || [];
        if(isChecked){
            compHosts = [...compHosts, host]
        }else{
            compHosts = compHosts.filter(item=>Object.keys(item)[0] !== Object.keys(host)[0]);
        }
        this.setState({selectedHosts:{...this.state.selectedHosts, [component.name]:compHosts}})
    }
    showExperimentsGridview = ()=>{
        let finalExperimentJson = this._generateFinalExpJSON();
        if(finalExperimentJson){
            this.setState({savingFinalJson: true})
            this.props.submitFinalExperimentJSON(finalExperimentJson, (success, err)=>{
                this.setState({currentStep:"RUN_EXPERIMENT", savingFinalJson:false})
                if(success){
                    showSuccessNotification("Successfully saved the final experiment data");
                    this._loadExperimentConfigs();
                }else{
                    showErrorNotification(`Something went wrong: ${err}`)
                }
            });
        }else{
            this.setState({currentStep:"RUN_EXPERIMENT"})
        }
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
                        hosts: envComponents.find(item2=>item2.name===item.name).environmentConfig.hosts
                    })), 
                    isExperimentValidated:true,
                    selectedHosts: components.map(item=>({[item.name]:{ hosts:[] }}))
                });
            }
        }
    }
    handleStartExperiment = (finalExpConfig)=>{
        this.props.startExperiment(finalExpConfig, (success, data)=>{
            if(success){
                this.props.history.push({
                    pathname: RUN_EXPERIMENT_STATUS_ROUTE,
                    state: {config:finalExpConfig, experimentId:data.experimentId}
                });
            } else {
                showErrorNotification("Something went wrong: "+data)
            }
        });
    }
    componentDidMount(){
        this._loadEnvironmentConfigs();
        this._loadExperimentConfigs()
    }
    componentWillReceiveProps(props){
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
                                    steps={ [{title: 'Validate Experiment'}, {title: 'Run Experiment'}] } activeStep={ this.state.currentStep==="RUN_EXPERIMENT"?1:0 } />
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
                                <div>
                                    <Button 
                                        style={{height:"100%", fontSize:14}} 
                                        color="teal" 
                                        disabled={!this.state.selectedExperiment || !this.state.selectedEnvironment}
                                        onClick={this.validateExperiment}>
                                        VALIDATE EXPERIMENT
                                    </Button>
                                </div>
                            </div>
                            {this.state.isExperimentValidated && this.state.currentStep === "CONFIGURE_ENV" &&
                                <div className="experiment-setup-display">
                                    <div className="title">Configure the environment and experiment</div>
                                    <div className="esd-content">
                                        <div className="absolute-content">
                                            <CustomAccordion panels={this.state.experimentComponents.map(item=>({
                                                key: item.name,
                                                header: item.name,
                                                content: <AccordionContent selectedHosts={this.state.selectedHosts} data={item} toggleHostSelection={this.handleToggleSelectHost}/>
                                            }))} />
                                        </div>
                                    </div>
                                </div>
                            }
                            {this.state.currentStep === "RUN_EXPERIMENT" && 
                                <div className="experiment-setup-display">
                                    <div className="title">Experiment List</div>
                                    <div className="esd-content">
                                        <div className="absolute-content">
                                            <Table unstackable>
                                                <Table.Header>
                                                    <Table.Row>
                                                        <Table.HeaderCell>Name</Table.HeaderCell>
                                                        <Table.HeaderCell textAlign='right'>Actions</Table.HeaderCell>
                                                    </Table.Row>
                                                </Table.Header>

                                                <Table.Body>
                                                    {this.props.finalExperiments.filter(item=>item.experimentStatus==="NOT_EXECUTED").map(item=>{
                                                        return (
                                                            <Table.Row>
                                                                <Table.Cell>{(item.experiment||{}).description}</Table.Cell>
                                                                <Table.Cell textAlign='right'>
                                                                    <Button size="large" color="blue" icon><Icon name="eye" /></Button>
                                                                    <Button size="large" color="green" icon onClick={()=>this.handleStartExperiment(item)}>
                                                                        <Icon name="play" />
                                                                    </Button>
                                                                    <Button size="large" color="orange" icon><Icon name="stop" /></Button>
                                                                    <Button size="large" negative icon> <Icon name="trash" /> </Button>
                                                                </Table.Cell>
                                                            </Table.Row>
                                                        )
                                                    })}
                                                </Table.Body>
                                            </Table>
                                        </div>
                                    </div>
                                </div>

                            }
                        </div>
                    </div>
                    <div className="controls">
                        <Button 
                            size="big" 
                            disabled={this.state.currentStep==="CONFIGURE_ENV"}
                            onClick={()=>this.setState({currentStep:"CONFIGURE_ENV"})}
                            primary>
                                <Icon name="arrow left" /> Back
                        </Button>
                        <Button 
                            size="big" 
                            onClick={this.showExperimentsGridview} 
                            disabled={ this.state.currentStep==="RUN_EXPERIMENT" }
                            loading={this.state.savingFinalJson}
                            primary>
                                Next <Icon name="arrow right" />
                        </Button>
                    </div>
                </Segment>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)( RunExperimentScreen )