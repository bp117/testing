import React from "react";
import { Modal, Button, Icon } from "semantic-ui-react";
import JSONEditor from 'react-json-view'

export default class EditJSONModal extends React.Component {
    state = { editData: ""}
    componentWillReceiveProps(nextProps){
        if(nextProps.data !== this.props.data){
            this.setState({editData:nextProps.data})
        }
    }
    render(){
        return (
            <Modal open={this.props.open}>
                <div className="app-modal">
                    <div className="app-modal-header">
                        <h4 style={{fontSize:20, fontWeight:"bold"}}><span style={{color:"#0D47A1"}}>{this.state.editData && this.state.editData.name}</span> Component Definition</h4>
                    </div>
                    <div className="app-modal-content">
                        <div className="absolute-content">
                            <JSONEditor
                                src={this.state.editData}
                                onAdd={(data)=>this.setState({editData: data.updated_src})}
                                onEdit={(data)=>this.setState({editData: data.updated_src})}
                                onDelete={(data)=>this.setState({editData: data.updated_src})}
                                style={{width:"100%", height:"100%", fontSize:14, padding:"0 10px"}}
                            />
                        </div>
                    </div>
                    <div className="app-modal-footer">
                        <div className="match-parent" style={{textAlign:"right"}}>
                            <Button color="orange" size="large" onClick={this.props.onClose}><Icon name="remove" /> Cancel</Button>
                            <Button positive size="large" onClick={()=>this.props.onEdit(this.state.editData)}><Icon name="check" /> Update</Button>
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }
}