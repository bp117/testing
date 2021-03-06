import React from "react";
import "./widget-styles.scss"
import { Segment } from "semantic-ui-react";

export default class CustomAccordion extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            opened: (props.panels||[]).filter(item=>item.open).map(item=>item.key)
        }
    }
    togglePanel=(panel, indx)=>{
        this.props.onOpenStateChange && this.props.onOpenStateChange(panel.key, !this.state.opened.includes(panel.key))
        if(this.state.opened.includes(panel.key)){
            this.setState({opened:this.state.opened.filter(t=>t!==panel.key)})
        }else{
            if(this.props.isSingleOpen){
                this.setState({opened:[panel.key]});
            }else{
                this.setState({opened:[...this.state.opened, panel.key]});
            }
        }
    }
    render(){
        return (
            <div className="match-parent">
                {(this.props.panels||[]).map((item,indx)=>(
                    <Segment className="accordion-container" key={item.key}>
                        <div className="panel-header" style={item.headerStyle} onClick={()=>this.togglePanel(item, indx)}>{item.header}</div>
                        <div className={"panel-content "+(this.state.opened.includes(item.key)?"":"closed-panel")}>
                            {item.content}
                        </div>    
                    </Segment>
                ))}
            </div>
        )
    }
}