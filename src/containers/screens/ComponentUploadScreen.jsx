import React from "react";
import { Button } from "semantic-ui-react";
import Dropzone from "react-dropzone";

export default class ComponentUploadScreen extends React.Component{
    render(){
        return (
            <div className="match-parent upload-screen">
                <div className="upload-view">
                    <div className="match-parent content">
                        <h4>Upload Component Definition File</h4>
                        <div className="upload-zone-container">
                            <div className="upload-zone">
                                <Dropzone>
                                    {({getRootProps, getInputProps}) => (
                                        <div {...getRootProps()} className="match-parent">
                                            <input {...getInputProps()} />
                                            <span>Or Drag and Drop it here</span>
                                        </div>
                                    )}
                                </Dropzone>
                            </div>
                            <div style={{width:"100%"}}>
                                <Button style={{width:"100%"}} size="large">Upload File</Button>
                            </div>
                        </div>    
                    </div>
                </div>
                <div className="uploaded-view">
                        Here is the uploaded view
                </div>
            </div>
        )
    }
}