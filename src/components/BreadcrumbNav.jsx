import React from "react";
import { Breadcrumb } from "semantic-ui-react";

export default class BreadcrumbNav extends React.Component{
    render(){
        return (
            <div className="breadcrumb-nav-container">
                <div className="container">
                    <Breadcrumb className="match-parent center-top" size="huge">
                        <Breadcrumb.Section link>Home</Breadcrumb.Section>
                        <Breadcrumb.Divider icon='right chevron' />
                        <Breadcrumb.Section link>Registration</Breadcrumb.Section>
                        <Breadcrumb.Divider icon='right arrow' />
                        <Breadcrumb.Section active>Personal Information</Breadcrumb.Section>
                    </Breadcrumb>
                </div>
            </div>
        )
    }
}