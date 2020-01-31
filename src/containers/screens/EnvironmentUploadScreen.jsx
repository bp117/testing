import React from "react";
import { Button, Table, Icon } from "semantic-ui-react";
import Dropzone from "react-dropzone";
import * as actions from "../../actions/environmentActions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import EditJSONModal from "../../components/modals/EditJSONModal";
import { confirmationAlert, showWarningNotification, showErrorNotification, showSuccessNotification } from "../../components/utils/alerts";

function mapStateToProps(state){
    return {
        isUploading: state.environments.isUploadingEnvironmentDef,
        environments: state.environments.environments
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(actions, dispatch);
}

class EnvironmentUploadScreen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isFileDragOver: false,
            envsToUpload: []
        }
        this.inputRef = React.createRef()
    }
    
    _isValidEnvironmentJson = (jsonData)=>{
        return true //for now
    }

    openFileChooser = ()=>{
        this.inputRef.current.click();
    }
    removeFileFromUploadList = (item)=>{
        this.setState({envsToUpload:this.state.envsToUpload.filter(item2=>item2.name !== item.name)})
    }
    handleFileDrop = (files=[])=>{
        this.setState({isFileDragOver:false});
        files.forEach(file=>{
            let reader = new FileReader();
            reader.onload = evt=>{
                try{
                    let jsonData = JSON.parse(evt.target.result);
                    if(this._isValidEnvironmentJson(jsonData)){
                        if(!this.state.envsToUpload.some(item=>item.name===jsonData.name)){
                            this.setState({ envsToUpload: [ jsonData, ...this.state.envsToUpload ] });
                        }else{
                            showWarningNotification(`An environment config with the name "${jsonData.name}" has already been added`);
                        }
                    }else{
                        showErrorNotification("The environment configuration JSON provided is not valid.")
                    }
                }catch(err){
                    showErrorNotification(`The file ${file.name} does not contain a valid JSON object`);
                }
            }
            reader.readAsText(file)
        });
    }
    handleUploadEnvironmentConfigs = ()=>{
        this.state.envsToUpload.forEach(envConfig=>{
            this.props.uploadEnvironmentConfig(envConfig, (success, error)=>{
                if(success){
                    this.setState({envsToUpload:this.state.envsToUpload.filter(item=>item.id !== envConfig.id)}, ()=>{
                        this.loadEnvironmentConfigs();
                        showSuccessNotification(`${envConfig.name} data was successfully saved!`)
                    })
                }else{  
                    showErrorNotification(`Something went wrong: "${error}"`)
                }
            })
        });
    }
    handleDeleteEnvironmentConfig = (item, callback=()=>{})=>{
        confirmationAlert(`Delete ${item.name} environment config?`, ()=>{
            this.props.deleteEnvironmentConfig(item._id, (success, error)=>{
                if(success){
                    this.loadEnvironmentConfigs();
                    showSuccessNotification(`${item.name} data was deleted!`)
                }else{
                    showErrorNotification(`Something went wrong: "${error}"`)
                }
                callback(success);
            })
        }, {okBtnText:"Yes, Delete", cancelBtnText:"Cancel"})
    }
    handleUpdateEnvironmentConfig = (data)=>{
        this.props.updateEnvironmentConfig(data, (success, err)=>{
            this.setState({editEnvironmentData:null});
            if(success){
                this.loadEnvironmentConfigs()
                showSuccessNotification(`${envConfig.name} data was successfully updated!`)
            }else {
                showErrorNotification(`Something went wrong: "${error}"`)
            }
        });
    }
    setEditData = (item)=>{
        this.setState({editEnvironmentData:item})
    }
    loadEnvironmentConfigs = ()=>{
        this.props.getEnvironmentConfig((success, error)=>{
            if(!success){
                showErrorNotification(`Something went wrong: "${error}"`)
            }
        });
    }
    componentDidMount(){
        this.loadEnvironmentConfigs()
    }
    render(){
        return (
            <div className="match-parent upload-screen">
                <div className="upload-view">
                    <div className="match-parent content">
                        <h4>Upload Environment Configuration Files</h4> 
                        <div className="upload-zone-container">
                            <div className="upload-zone">
                                <Dropzone 
                                    onDragLeave={()=>this.setState({isFileDragOver:false})} 
                                    onDragOver={()=>this.setState({isFileDragOver:true})}
                                    onDrop={this.handleFileDrop}>
                                    {({getRootProps, getInputProps}) => (
                                        <div {...getRootProps()} className={"match-parent drop-zone "+(this.state.isFileDragOver?"drag-over":"")}>
                                            {this.state.isFileDragOver?
                                                <div className="drag-over-desc">Drop your environment configuration file</div>
                                                :
                                                <React.Fragment>
                                                    <input ref={this.inputRef} type="file" onChange={(evt)=>this.handleFileDrop([...evt.target.files])} multiple className="hidden"/>
                                                    {this.state.envsToUpload.length==0 ?
                                                        <div className="match-parent center-content">
                                                            <Button primary size="big" onClick={this.openFileChooser}> <Icon name="add" /> Choose File...</Button>
                                                        </div>
                                                        :
                                                        <div className="match-parent" style={{padding:10, display:"flex", flexDirection:"column"}}>
                                                            <div style={{flex:1, position:"relative"}}>
                                                                <div className="absolute-content" style={{paddingBottom:10}}>
                                                                    {
                                                                        this.state.envsToUpload.map((item, indx)=>(
                                                                            <div style={{padding:"5px 10px"}}>
                                                                                <span style={{marginRight:20}}>{item.name}</span>
                                                                                <Icon name="trash" style={{fontSize:16, cursor:"pointer"}} color="red" onClick={()=>this.removeFileFromUploadList(item)}/>
                                                                            </div>
                                                                        ))
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div style={{width:"100%", zIndex:9}}>
                                                                <Button primary size={"big"} onClick={this.openFileChooser}><Icon name="add" /> Add another file...</Button>
                                                            </div>
                                                        </div>
                                                    }
                                                    <div className="desc">Or Drag and Drop it here</div>
                                                </React.Fragment>
                                            }
                                        </div>
                                    )}
                                </Dropzone>
                            </div>
                            <div style={{width:"100%"}}>
                                <Button 
                                    style={{width:"100%"}} 
                                    color="teal" size="big" 
                                    onClick={this.handleUploadEnvironmentConfigs} 
                                    disabled={this.state.envsToUpload.length===0} 
                                    loading={this.props.isUploading}>
                                    <Icon name="upload" />Upload File{this.state.envsToUpload.length>0?"s":""}
                                </Button>
                            </div>
                        </div>    
                    </div>
                </div>
                <div className="uploaded-view">
                    <h4 className="title">Environment Config files</h4>
                    <div style={{position:"relative", flex:1, marginTop:10}}>
                        <div className="absolute-content">
                            {this.props.environments && this.props.environments.length>0 ?
                                <Table striped selectable>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Environment</Table.HeaderCell>
                                            <Table.HeaderCell textAlign="right"></Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>

                                    <Table.Body>
                                        {this.props.environments.map(item=>(
                                            <Table.Row>
                                                <Table.Cell>{item.name}</Table.Cell>
                                                <Table.Cell textAlign="right">
                                                    <Button size="large" primary onClick={()=>this.setEditData(item)}><Icon name="eye" />View </Button>
                                                    <Button size="large" negative onClick={()=>this.handleDeleteEnvironmentConfig(item)}><Icon name="trash" />Delete</Button>
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>
                                :
                                <div style={{color:"#880E4F", fontSize:17}}>
                                    None Available
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <EditJSONModal 
                    open={!!this.state.editEnvironmentData} 
                    data={this.state.editEnvironmentData}
                    onClose={()=>this.setState({editEnvironmentData:null})}
                    onDelete={()=>{this.handleDeleteEnvironmentConfig(this.state.editEnvironmentData, ()=>{
                        this.setState({editEnvironmentData:null})
                    })}}
                    onEdit={this.handleUpdateEnvironmentConfig} />
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EnvironmentUploadScreen)