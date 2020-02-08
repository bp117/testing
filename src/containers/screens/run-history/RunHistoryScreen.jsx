import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Header, Segment, Button, Icon, Dropdown, Checkbox, Table, Label, Menu } from "semantic-ui-react";
import "./run-history-styles.scss";
import CustomAccordion from "../../../components/widgets/CustomAccordion";
import * as experimentActions from "../../../actions/experimentActions";
import * as environmentActions from "../../../actions/environmentActions";
import { showErrorNotification, errorAlert, showSuccessNotification, confirmationAlert } from "../../../components/utils/alerts";

function mapStateToProps(state){
    return {
        isFetchingRunHistory: state.environments.isFetchingRunHistory,
        isFetchingExperiment: state.experiments.isFetchingExperiment,
        finalExperiments: state.experiments.finalExperiments,
        runHistory: state.experiments.runHistory
    }
}
function mapDispatchToProps(dispatch){
    return bindActionCreators({...experimentActions, ...environmentActions}, dispatch)
}

class RunExperimentScreen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            runHistory: [],
            currentPage: 0
        }

        this.maxTableRows = 10
    }
    _loadExperimentRunHistory = ()=>{
        this.props.fetchExperimentRunHistory((success, error)=>{
            if(!success){
                showErrorNotification(`Something went wrong: "${error}"`)
            }
        });
    }
    _loadExperimentConfigs = ()=>{
        this.props.fetchFinalExperimentJSON((success, error)=>{
            if(!success){
                showErrorNotification(`Something went wrong while fetching the final experiment json data: "${error}"`)
            }
        })
    }

    loadRowData = (pageNum, props=this.props)=> {
        this.setState({
            runHistory: props.runHistory.slice(pageNum*this.maxTableRows, (pageNum+1)*this.maxTableRows),
            currentPage: pageNum
        }, ()=>{
            if(this.state.runHistory.length==0 && this.state.currentPage>0){
                this.loadRowData(this.state.currentPage - 1);
            }
        })
    }

    handleDeleteExperimentRun = (item) => {
        confirmationAlert("Delete?", ()=>{
            this.props.deleteExperimentRun(item.experimentId, (success)=>{
                if(success){
                    this._loadExperimentRunHistory()
                }
            });
        }, {okBtnText:"YES, DELETE"})
    }

    componentDidMount(){
        this._loadExperimentConfigs();
        this._loadExperimentRunHistory();
    }
    componentWillReceiveProps(props){
        this.loadRowData(this.state.currentPage, props);
    }
    render(){
        return (
            <div className="match-parent" style={{padding:10}}>
                <Segment className="match-parent run-experiment">
                    <div className="header">Experiment Run history</div>
                    <div className="body" style={{position:"relative"}}>
                        <div className="absolute-content" style={{padding:20}}>
                            {(this.props.isFetchingExperiment || this.props.isFetchingRunHistory) ?
                                <div className="match-parent center-content"><div className="spinning-loader" /></div>
                                :
                                this.props.runHistory.length == 0 ?
                                <div className="match-parent center-content">
                                    <div style={{textAlign:"center"}}>
                                        <h3>No history yet!</h3>
                                        <h5>All your executed experiments will be listed here</h5>
                                    </div>
                                </div>
                                :
                                <Table celled>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Experiment Run Id</Table.HeaderCell>
                                            <Table.HeaderCell>Experiment Configuration</Table.HeaderCell>
                                            <Table.HeaderCell>Status</Table.HeaderCell>
                                            <Table.HeaderCell></Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>

                                    <Table.Body>
                                        {this.state.runHistory.map(item=>(
                                            <Table.Row>
                                                <Table.Cell>{item.experimentId}</Table.Cell>
                                                <Table.Cell>{((this.props.finalExperiments.find(item2=>item2._id === item.finalExpConfigId)||{}).experiment||{}).description || <span style={{color:"red"}}>[Not Found]</span>}</Table.Cell>
                                                <Table.Cell>
                                                    <span style={{color:item.status === "STARTED"?"#1976D2": item.status=== "COMPLETED"? "#0097A7": item.status==="STOPPED"? "#b71c1c":"#F9A825"}}>
                                                        {item.status}
                                                    </span>
                                                </Table.Cell>
                                                <Table.Cell textAlign="right">
                                                    <Button icon color="green" style={{marginRight:5}} disabled={item.status==="STARTED"}>
                                                        <Icon name="play" style={{fontSize:12}}/>
                                                    </Button>
                                                    <Button icon color="orange" style={{marginRight:5}} disabled={item.status==="COMPLETED"||item.status == "STOPPED"}>
                                                        <Icon name="stop" style={{fontSize:12}}/>
                                                    </Button>
                                                    <Button icon negative onClick={()=>this.handleDeleteExperimentRun(item)}>
                                                        <Icon name="trash" style={{fontSize:12}}/>
                                                    </Button>
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>

                                    {this.props.runHistory.length > this.maxTableRows &&
                                        <Table.Footer>
                                            <Table.Row>
                                                <Table.HeaderCell colSpan='4'>
                                                <Menu floated='right' pagination>
                                                    <Menu.Item as='a' icon disabled> 
                                                        <Icon name='chevron left' />
                                                    </Menu.Item>
                                                    { Array(Math.ceil(this.props.runHistory.length / this.maxTableRows )).fill(0).map((_, ind)=>(
                                                        <Menu.Item as='a' onClick={()=>this.loadRowData(ind)} active={this.state.currentPage == ind}>{ind+1}</Menu.Item>
                                                    ))}
                                                    <Menu.Item as='a' icon disabled>
                                                        <Icon name='chevron right' />
                                                    </Menu.Item>
                                                </Menu>
                                                </Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Footer>
                                    }
                                </Table>
                            }
                        </div>
                    </div>
                </Segment>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)( RunExperimentScreen )