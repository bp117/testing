import React from "react";
import { confirmAlert } from 'react-confirm-alert'; // Import
import { Button, Icon } from "semantic-ui-react";
import { store } from 'react-notifications-component';

export const confirmationAlert = (message, successCallback, options)=>{
    options = options || {okBtnText:"YES", cancelBtnText:"NO"}
    confirmAlert({
        title: options.title || 'Confirm Action',
        message: message,
        customUI: ({ onClose, message, title }) => {
            return (
              <div className='confirm-alert-dialog'>
                <h4 className="title">{title}</h4>
                <p className="message">{message}</p>
                <div className="actions">
                    <Button onClick={onClose} size="big">
                      <Icon name="remove" />
                      {options.cancelBtnText || "NO"}
                    </Button>
                    <Button
                      onClick={() => {
                          successCallback();
                          onClose();
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