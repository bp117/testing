import React from "react";
import { Modal, Button, Icon, Table, Tab } from "semantic-ui-react";

export default class LogDataModal extends React.Component {
    state = { logData: []}
    componentWillReceiveProps(nextProps){
        if(nextProps.data !== this.props.data){
            this.setState({logData:nextProps.data})
        }
    }
    render(){
        return (
            <Modal open={this.props.open} size="large">
                <div className="app-modal">
                    <div className="app-modal-header">
                        <h4 style={{fontSize:20, fontWeight:"bold"}}>
                            <><span style={{color:"#0D47A1"}}>Log details: `<span>{this.props.logName}</span>` </span></>
                        </h4>
                    </div>
                    <div className="app-modal-content">
                        <div className="absolute-content">
                            {(this.state.logData||[]).length>0?
                                <Table style={{fontSize:14}} striped selectable>
                                    <Table.Header>
                                        <Table.Row>
                                            {(Object.keys(this.state.logData[0]||[])).map(logItem=>(
                                                <Table.HeaderCell>
                                                    {logItem}
                                                </Table.HeaderCell>
                                            ))}
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Header>
                                        {(this.state.logData || []).map(item=>(
                                            <Table.Row>
                                                {Object.keys(item).map(logItem=>(
                                                    <Table.Cell>
                                                        {item[logItem]}
                                                    </Table.Cell>
                                                ))}
                                            </Table.Row>
                                        ))}
                                    </Table.Header>
                                </Table>
                                :
                                <div className="match-parent center-content">
                                    <h3>No logs</h3>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="app-modal-footer">
                        <div className="match-parent" style={{textAlign:"right"}}>
                            <Button primary onClick={this.props.onClose} size="large">Close</Button>
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }
}