import { SUBMIT_EXPERIMENT_JSON_REQUEST, SUBMIT_EXPERIMENT_JSON_SUCCESS, SUBMIT_EXPERIMENT_JSON_FAILURE, SUBMIT_COMPONENT_DEPENENCY_REQUEST, SUBMIT_COMPONENT_DEPENENCY_SUCCESS, SUBMIT_COMPONENT_DEPENENCY_FAILURE } from "../constants/action_types";
import { SUBMIT_EXPERIMENT_JSON_URL, SUBMIT_COMP_DEPENDENCY_URL } from "../constants/api_endpoints";
import { genericRequest } from "./__utils__";
import { apiHttpPOST } from "../utils/request_helper";

export const submitExperimentJSON = (data, callback=()=>{})=>{
    return genericRequest({
        request_action: SUBMIT_EXPERIMENT_JSON_REQUEST,
        success_action: SUBMIT_EXPERIMENT_JSON_SUCCESS,
        failure_action: SUBMIT_EXPERIMENT_JSON_FAILURE,
        callback: callback,
        requestMethod: apiHttpPOST,
        requestBody: data,
        endpoint: SUBMIT_EXPERIMENT_JSON_URL
    });
}

export const submitCompDependencyData = (data, callback=()=>{})=>{
    return genericRequest({
        request_action: SUBMIT_COMPONENT_DEPENENCY_REQUEST,
        success_action: SUBMIT_COMPONENT_DEPENENCY_SUCCESS,
        failure_action: SUBMIT_COMPONENT_DEPENENCY_FAILURE,
        callback: callback,
        requestMethod: apiHttpPOST,
        requestBody: data,
        endpoint: SUBMIT_COMP_DEPENDENCY_URL
    });
}