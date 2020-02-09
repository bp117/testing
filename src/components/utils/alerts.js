import React from "react";
import { confirmAlert } from 'react-confirm-alert'; // Import
import { Button, Icon } from "semantic-ui-react";
import { store } from 'react-notifications-component';

export const confirmationAlert = (message, successCallback, options, cancelCallback=()=>{})=>{
    options = options || {okBtnText:"YES", cancelBtnText:"NO"}
    options.autoClose = typeof options.autoClose == "boolean"? options.autoClose : true 
    confirmAlert({
        title: options.title || 'Confirm Action',
        message: message,
        customUI: ({ onClose, message, title }) => {
            return (
              <div className='confirm-alert-dialog'>
                <h4 className="title">{title}</h4>
                <div className="message">{message}</div>
                <div className="actions">
                    <Button onClick={()=>{
                      onClose(); cancelCallback();
                    }} size="big">
                      <Icon name="remove" />
                      {options.cancelBtnText || "NO"}
                    </Button>
                    <Button
                      onClick={() => {
                          successCallback(onClose);
                          if(options.autoClose){ onClose(); }
                      }}
                      size="big"
                      color={options.isPositiveBtn?"green":"red"}
                    >
                      <Icon name="check" /> {options.okBtnText || "YES"}
                    </Button>
                </div>
              </div>
            );
        }
    });
}

export const errorAlert = (message, onOkClick)=>{
    confirmAlert({
        title: 'Error',
        message: message,
        customUI: ({ onClose, message, title }) => {
            return (
              <div className='confirm-alert-dialog'>
                <h4 className="title" style={{color:"#b71c1c"}}>{title}</h4>
                <div className="message" style={{color:"#d32f2f"}}>{message}</div>
                <div className="actions">
                    <Button onClick={()=>{
                      onClose();
                      typeof onOkClick === "function" && onOkClick()
                    }} size="big" primary>
                      <Icon name="check" /> OK
                    </Button>
                </div>
              </div>
            );
        }
    });
}

export const showSuccessNotification = (message, duration)=>{
  store.addNotification({
    title: "Success",
    message,
    type: "success",
    insert: "top",
    container: "top-right",
    animationIn: ["animated", "bounceInRight"],
    animationOut: ["animated", "bounceOutRight"],
    waitForAnimation: true,
    showIcon: true,
    dismiss: {
      duration: duration || 10000,
    }
  });
}

export const showErrorNotification = (message, duration)=>{
  store.addNotification({
    title: "Oops!",
    message,
    type: "danger",
    insert: "top",
    container: "top-right",
    animationIn: ["animated", "bounceInRight"],
    animationOut: ["animated", "bounceOutRight"],
    waitForAnimation: true,
    showIcon: true,
    dismiss: {
      duration: duration || 10000,
    }
  });
}

export const showWarningNotification = (message, duration)=>{
  store.addNotification({
    title: "Warning",
    message,
    type: "warning",
    insert: "top",
    container: "top-right",
    animationIn: ["animated", "bounceInRight"],
    animationOut: ["animated", "bounceOutRight"],
    showIcon: true,
    waitForAnimation: true,
    dismiss: {
      duration: duration || 10000,
    }
  });
}

export const showNotification = (message, duration)=>{
  store.addNotification({
    title: "Notification",
    message,
    type: "info",
    insert: "top",
    container: "top-right",
    animationIn: ["animated", "bounceInRight"],
    animationOut: ["animated", "bounceOutRight"],
    waitForAnimation: true,
    showIcon: true,
    dismiss: {
      duration: duration || 10000,
    }
  });
}