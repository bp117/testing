import React from "react";
import { confirmAlert } from 'react-confirm-alert'; // Import
import { Button, Icon } from "semantic-ui-react";

export const confirmationAlert = (message, successCallback, options)=>{
    options = options || {okBtnText:"YES", cancelBtnText:"NO"}
    confirmAlert({
        title: 'Confirm Action',
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
                      negative
                    >
                      <Icon name="check" /> {options.okBtnText || "YES"}
                    </Button>
                </div>
              </div>
            );
        }
      });
}