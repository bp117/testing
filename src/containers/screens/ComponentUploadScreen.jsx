import React from "react";
import { Button, Table, Icon } from "semantic-ui-react";
import Dropzone from "react-dropzone";
import * as actions from "../../actions/componentActions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import EditJSONModal from "../../components/modals/EditJSONModal";
import { confirmationAlert } from "../../components/utils/alerts";

function mapStateToProps(state){
    return {
        isUploading: state.components.isUploadingComponentDef,
        components: state.components.components
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(actions, dispatch);
}

class ComponentUploadScreen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isFileDragOver: false,
            compsToUpload: []
        }
        this.inputRef = React.createRef()
    }
    _filterDuplicateUploads = (callback=()=>{})=>{
         this.setState({compsToUpload:this.state.compsToUpload.filter(item=>!this.state.compsToUpload.some(item2=>item2.name===item.name))});
    }
    _isValidComponentJson = (jsonData)=>{
        return true //for now
    }

    openFileChooser = ()=>{
        this.inputRef.current.click();
    }
    removeFileFromUploadList = (item)=>{
        this.setState({compsToUpload:this.state.compsToUpload.filter(item2=>item2.name !== item.name)})
    }
    handleFileDrop = (files=[])=>{
        this.setState({isFileDragOver:false});
        files.forEach(file=>{
            let reader = new FileReader();
            reader.onload = evt=>{
                try{
                    let jsonData = JSON.parse(evt.target.result);
                    if(this._isValidComponentJson(jsonData)){
                        if(!this.state.compsToUpload.some(item=>item.name===jsonData.name)){
                            this.setState({ compsToUpload: [ jsonData, ...this.state.compsToUpload ] });
                        }else{
                            //TODO: JSON ALREADY ADDED
                        }
                    }
                }catch(err){
                    console.log(err)
                    //TODO: INVALID JSON DATA PROVIDED, PROPERLY HANDLE ERROR HERE 
                }
            }
            reader.readAsText(file)
        });
    }
    handleUploadComponentDefinitions = ()=>{
        this.state.compsToUpload.forEach(compDefinition=>{
            this.props.uploadComponentDefinition(compDefinition, (success, data)=>{
                if(success){
                    this.setState({compsToUpload:this.state.compsToUpload.filter(item=>item.id !== compDefinition.id)}, ()=>{
                        this.loadComponentDefinitions();
                        //alert("GOOD") //HANLE THIS PROPERLY
                    })
                }else{  
                    console.log(data);
                    //TODO: HANDLE ERROR, SOMETHING HAPPENED WHILE TRYING TO UPLOAD DATA
                }
            })
        });
    }
    handleDeleteComponentDefinition = (item, callback=()=>{})=>{
        confirmationAlert(`Delete ${item.name} component definition?`, ()=>{
            this.props.deleteComponentDefinition(item._id, (success, err)=>{
                if(success){
                    this.loadComponentDefinitions()
                }else{
                    //TODO: HANDLE ERROR, COULD NOT DELETE COMPONENT DEFINITION
                }
                callback(success);
            })
        }, {okBtnText:"Yes, Delete", cancelBtnText:"Cancel"})
    }
    handleUpdateComponentDefinition = (data)=>{
        this.props.updateComponentDefinition(data, (success, err)=>{
            this.setState({editComponentData:null});
            if(success){
                this.loadComponentDefinitions()
            }else {
                //TODO: HANDLE ERROR, COULD NOT UPDATE COMPONENT DEFINITION
            }
        });
    }
    setEditData = (item)=>{
        this.setState({editComponentData:item})
    }
    loadComponentDefinitions = ()=>{
        this.props.getComponentDefinition((success, data)=>{
            if(!success){
                console.log(data);
                //TODO: HANDLE ERROR, SOMETHING HAPPENED WHILE TRYING TO UPLOAD DATA
            }
        });
    }
    componentDidMount(){
        this.loadComponentDefinitions()
    }
    render(){
        return (
            <div className="match-parent upload-screen">
                <div className="upload-view">
                    <div className="match-parent content">
                        <h4>Upload Component Definition File</h4> 
                        <div className="upload-zone-container">
                            <div className="upload-zone">
                                <Dropzone 
                                    onDragLeave={()=>this.setState({isFileDragOver:false})} 
                                    onDragOver={()=>this.setState({isFileDragOver:true})}
                                    onDrop={this.handleFileDrop}>
                                    {({getRootProps, getInputProps}) => (
                                        <div {...getRootProps()} className={"match-parent drop-zone "+(this.state.isFileDragOver?"drag-over":"")}>
                                            {this.state.isFileDragOver?
                                                <div className="drag-over-desc">Drop your component definition file</div>
                                                :
                                                <React.Fragment>
                                                    <input ref={this.inputRef} type="file" onChange={(evt)=>this.handleFileDrop([...evt.target.files])} multiple className="hidden"/>
                                                    {this.state.compsToUpload.length==0 ?
                                                        <div className="match-parent center-content">
                                                            <Button primary size="big" onClick={this.openFileChooser}> <Icon name="add" /> Choose File...</Button>
                                                        </div>
                                                        :
                                                        <div className="match-parent" style={{padding:10, display:"flex", flexDirection:"column"}}>
                                                            <div style={{flex:1, position:"relative"}}>
                                                                <div className="absolute-content" style={{paddingBottom:10}}>
                                                                    {
                                                                        this.state.compsToUpload.map((item, indx)=>(
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
                                    onClick={this.handleUploadComponentDefinitions} 
                                    disabled={this.state.compsToUpload.length===0} 
                                    loading={this.props.isUploading}>
                                    <Icon name="upload" />Upload File{this.state.compsToUpload.length>0?"s":""}
                                </Button>
                            </div>
                        </div>    
                    </div>
                </div>
                <div className="uploaded-view">
                    <h4 className="title">Component Definition files</h4>
                    <div style={{position:"relative", flex:1, marginTop:10}}>
                        <div className="absolute-content">
                            {this.props.components && this.props.components.length>0 ?
                                <Table striped selectable>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Component</Table.HeaderCell>
                                            <Table.HeaderCell>Version</Table.HeaderCell>
                                            <Table.HeaderCell>Catergory</Table.HeaderCell>
                                            <Table.HeaderCell textAlign="right"></Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>

                                    <Table.Body>
                                        {this.props.components.map(item=>(
                                            <Table.Row>
                                                <Table.Cell>{item.name}</Table.Cell>
                                                <Table.Cell>{item.metadata && item.metadata.version||"N/A"}</Table.Cell>
                                                <Table.Cell>{item.category||"N/A"}</Table.Cell>
                                                <Table.Cell textAlign="right">
                                                    <Button size="large" primary onClick={()=>this.setEditData(item)}><Icon name="eye" />View </Button>
                                                    <Button size="large" negative onClick={()=>this.handleDeleteComponentDefinition(item)}><Icon name="trash" />Delete</Button>
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
                    open={!!this.state.editComponentData} 
                    data={this.state.editComponentData}
                    onClose={()=>this.setState({editComponentData:null})}
                    onDelete={()=>{this.handleDeleteComponentDefinition(this.state.editComponentData, ()=>{
                        this.setState({editComponentData:null})
                    })}}
                    onEdit={this.handleUpdateComponentDefinition} />
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentUploadScreen)