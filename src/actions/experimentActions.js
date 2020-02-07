import { SUBMIT_EXPERIMENT_JSON_REQUEST, SUBMIT_EXPERIMENT_JSON_SUCCESS, SUBMIT_EXPERIMENT_JSON_FAILURE, SUBMIT_COMPONENT_DEPENENCY_REQUEST, SUBMIT_COMPONENT_DEPENENCY_SUCCESS, SUBMIT_COMPONENT_DEPENENCY_FAILURE, FETCH_EXPERIMENT_JSON_REQUEST, FETCH_EXPERIMENT_JSON_SUCCESS, FETCH_EXPERIMENT_JSON_FAILURE, SUBMIT_FINAL_EXPERIMENT_JSON_REQUEST, SUBMIT_FINAL_EXPERIMENT_JSON_SUCCESS, SUBMIT_FINAL_EXPERIMENT_JSON_FAILURE, FETCH_FINAL_EXPERIMENT_JSON_REQUEST, FETCH_FINAL_EXPERIMENT_JSON_SUCCESS, FETCH_FINAL_EXPERIMENT_JSON_FAILURE, START_EXPERIMENT_REQUEST, START_EXPERIMENT_SUCCESS, START_EXPERIMENT_FAILURE, FETCH_EXPERIMENT_RUN_HISTORY_REQUEST, FETCH_EXPERIMENT_RUN_HISTORY_SUCCESS, FETCH_EXPERIMENT_RUN_HISTORY_FAILURE } from "../constants/action_types";
import { SUBMIT_EXPERIMENT_JSON_URL, SUBMIT_COMP_DEPENDENCY_URL, LOAD_EXPERIMENT_JSON_URL, SUBMIT_FINAL_EXPERIMENT_JSON_URL, LOAD_FINAL_EXPERIMENT_JSON_URL, START_EXPERIMENT_URL, EXPERIMENT_STATUS_URL, EXPERIMENT_RUN_HISTORY_URL, DELETE_EXPERIMENT_RUN_URL, DELETE_FINAL_EXPERIMENT_JSON_URL } from "../constants/api_endpoints";
import { genericRequest } from "./__utils__";
import { apiHttpPOST, apiHttpGET, apiHttpDELETE } from "../utils/request_helper";

export const fetchExperimentJSON = (callback=()=>{})=>{
    return genericRequest({
        request_action: FETCH_EXPERIMENT_JSON_REQUEST,
        success_action: FETCH_EXPERIMENT_JSON_SUCCESS,
        failure_action: FETCH_EXPERIMENT_JSON_FAILURE,
        callback: callback,
        requestMethod: apiHttpGET,
        endpoint: LOAD_EXPERIMENT_JSON_URL
    });
}

export const fetchFinalExperimentJSON = (callback=()=>{})=>{
    return genericRequest({
        request_action: FETCH_FINAL_EXPERIMENT_JSON_REQUEST,
        success_action: FETCH_FINAL_EXPERIMENT_JSON_SUCCESS,
        failure_action: FETCH_FINAL_EXPERIMENT_JSON_FAILURE,
        callback: callback,
        requestMethod: apiHttpGET,
        endpoint: LOAD_FINAL_EXPERIMENT_JSON_URL
    });
}

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

export const submitFinalExperimentJSON = (data, callback=()=>{})=>{
    return genericRequest({
        request_action: SUBMIT_FINAL_EXPERIMENT_JSON_REQUEST,
        success_action: SUBMIT_FINAL_EXPERIMENT_JSON_SUCCESS,
        failure_action: SUBMIT_FINAL_EXPERIMENT_JSON_FAILURE,
        callback: callback,
        requestMethod: apiHttpPOST,
        requestBody: {...data, experimentStatus:"NOT_EXECUTED"},
        endpoint: SUBMIT_FINAL_EXPERIMENT_JSON_URL
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

export const startExperiment = (finalExpConfig, callback=()=>{})=>{
    return genericRequest({
        request_action: START_EXPERIMENT_REQUEST,
        success_action: START_EXPERIMENT_SUCCESS,
        failure_action: START_EXPERIMENT_FAILURE,
        callback: callback,
        requestMethod: apiHttpPOST,
        requestBody: finalExpConfig,
        endpoint: START_EXPERIMENT_URL
    });
}

export const getExperimentStatus = (experimentId, callback=()=>{}) => {
    return genericRequest({
        request_action: "NO_ACTION",
        success_action: "NO_ACTION",
        failure_action: "NO_ACTION",
        callback: callback,
        requestMethod: apiHttpGET,
        queryStrings: {experimentId},
        endpoint: EXPERIMENT_STATUS_URL
    });
}


export const fetchExperimentRunHistory = (callback=()=>{}) => {
    return genericRequest({
        request_action: FETCH_EXPERIMENT_RUN_HISTORY_REQUEST,
        success_action: FETCH_EXPERIMENT_RUN_HISTORY_SUCCESS,
        failure_action: FETCH_EXPERIMENT_RUN_HISTORY_FAILURE,
        callback: callback,
        requestMethod: apiHttpGET,
        endpoint: EXPERIMENT_RUN_HISTORY_URL
    })
}

export const deleteExperimentRun = (experimentId, callback=()=>{}) => {
    return genericRequest({
        request_action: "NO_ACTION",
        success_action: "NO_ACTION",
        failure_action: "NO_ACTION",
        callback: callback,
        queryStrings: {experimentId},
        requestMethod: apiHttpGET,
        endpoint: DELETE_EXPERIMENT_RUN_URL
    })
}

export const deleteFinalExperiment = (finalExperimentId, callback=()=>{}) => {
    return genericRequest({
        request_action: "NO_ACTION",
        success_action: "NO_ACTION",
        failure_action: "NO_ACTION",
        callback: callback,
        queryStrings: {finalExperimentId},
        requestMethod: apiHttpGET,
        endpoint: DELETE_FINAL_EXPERIMENT_JSON_URL
    })
}