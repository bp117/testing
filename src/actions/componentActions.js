import { genericRequest } from "./__utils__";
import { apiHttpPOST, apiHttpGET } from "../utils/request_helper";
import { UPLOAD_COMPONENT_DEFINITION_REQUEST, UPLOAD_COMPONENT_DEFINITION_SUCCESS, UPLOAD_COMPONENT_DEFINITION_FAILURE, FETCH_COMPONENT_DEFINITION_REQUEST, FETCH_COMPONENT_DEFINITION_SUCCESS, FETCH_COMPONENT_DEFINITION_FAILURE } from "../constants/action_types";
import { UPLOAD_COMPONENT_DEFINITION_URL, COMPONENT_DEFINITION_DATA_URL } from "../constants/api_endpoints";

export const uploadComponentDefinition = (data, callback=()=>{})=>{
    return genericRequest({
        request_action: UPLOAD_COMPONENT_DEFINITION_REQUEST,
        success_action: UPLOAD_COMPONENT_DEFINITION_SUCCESS,
        failure_action: UPLOAD_COMPONENT_DEFINITION_FAILURE,
        callback: callback,
        requestMethod: apiHttpPOST,
        endpoint: UPLOAD_COMPONENT_DEFINITION_URL,
        requestBody: data
    });
}

export const getComponentDefinition = (callback=()=>{})=>{
    return genericRequest({
        request_action: FETCH_COMPONENT_DEFINITION_REQUEST,
        success_action: FETCH_COMPONENT_DEFINITION_SUCCESS,
        failure_action: FETCH_COMPONENT_DEFINITION_FAILURE,
        callback: callback,
        requestMethod: apiHttpGET,
        endpoint: COMPONENT_DEFINITION_DATA_URL
    });
}