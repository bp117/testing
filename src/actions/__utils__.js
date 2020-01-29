import { formatUrl } from "../utils/misc";

export const createAction = (type, payload)=>{
    return {type, payload}
}


export function genericRequest(config) {
    function dispatchFailedRequest(dispatch, error) {
        dispatch(typeof config.failure_action == "function" ? config.failure_action(error) : createAction(config.failure_action, error));
        config.callback(false, error);
    }
    return (dispatch, getState) => {
        dispatch(typeof config.request_action == "function" ? config.request_action() : createAction(config.request_action, config.requestActionData));
        config
            .requestMethod(formatUrl(config.endpoint, config.queryStrings, config.dynamicParams), null, config.requestBody)
            .then(response => {
                if (response.status >= 200 && response.status <= 299) {
                    let data = typeof config.processData === "function" ? config.processData(response.data, dispatch) : response.data;
                    if (typeof response.data.success === "boolean" && !response.data.success) {
                        dispatch(createAction(config.failure_action, data));
                        config.callback(false, response.data.message);
                    } else {
                        dispatch(typeof config.success_action == "function" ? config.success_action(data) : createAction(config.success_action, data));
                        config.callback(true, data);
                    }
                } else {
                    dispatchFailedRequest(dispatch, `Request failed with Status Code ${response.status}`);
                }
            })
            .catch(error => {
                dispatchFailedRequest(
                    dispatch,
                    error.response && error.response.data
                        ? error.response.data
                        : error.message
                        ? error.message
                        : error
                        ? `${error}`
                        : "Something went wrong"
                );
            });
    };
}

/**
 values for config:
 {
     request_action,
     success_action,
     failure_action,
     processData,
     callback,
     requestMethod,
     endpoint,
     queryStrings,
     dynamicParams,
     token,
     requestBody,
     requestActionData,
     reAuthIfNecessary
 }
 */