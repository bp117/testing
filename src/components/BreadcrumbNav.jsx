import React, { Fragment } from "react";
import { Breadcrumb } from "semantic-ui-react";
import { withRouter } from "react-router-dom";

class BreadcrumbNav extends React.Component{
    state = { paths:[] }
    componentWillReceiveProps(nextProps){
        this.setState({
            paths: nextProps.location.pathname.split("/").filter(item=>item.trim())
        });
    }
    handleBreadcrumb = (index)=>{
        let path = "/"
        for(let i in this.state.paths){
            path+=this.state.paths[i]+"/";
            if(+i===index){
                break;
            }
        }
        this.props.history.push(path.slice(0, -1))
    }
    render(){
        const {paths} = this.state;
        return (
            <div className="breadcrumb-nav-container" style={{marginLeft:25, zIndex:2}}>
                <div className="container">
                    <Breadcrumb className="match-parent center-top" size="huge" style={{padding:"11px", fontSize:17, fontFamily:"Josefin Sans"}}>
                        {paths.map((item,indx)=>{
                            let hasLink = indx !== paths.length - 1; 
                            return (
                                <Fragment key={Math.random()+""}>
                                    { indx===paths.length-1 && paths.length>1 && <Breadcrumb.Divider icon='right arrow' /> }
                                    <Breadcrumb.Section active={indx===paths.length-1} onClick={hasLink? ()=>this.handleBreadcrumb(indx) : undefined}>{item}</Breadcrumb.Section>
                                    { indx!==paths.length-1 && indx!==paths.length-2 && <Breadcrumb.Divider icon='right chevron' /> }
                                </Fragment>
                            )
                        })}
                    </Breadcrumb>
                </div>
            </div>
        )
    }
}

export default withRouter(BreadcrumbNav);