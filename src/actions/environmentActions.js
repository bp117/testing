import { genericRequest } from "./__utils__";
import { apiHttpPOST, apiHttpGET } from "../utils/request_helper";
import { 
    UPLOAD_ENVIRONMENT_CONFIG_REQUEST, 
    UPLOAD_ENVIRONMENT_CONFIG_SUCCESS, 
    UPLOAD_ENVIRONMENT_CONFIG_FAILURE, 
    FETCH_ENVIRONMENT_CONFIG_REQUEST, 
    FETCH_ENVIRONMENT_CONFIG_SUCCESS, 
    FETCH_ENVIRONMENT_CONFIG_FAILURE, 
    DELETE_ENVIRONMENT_CONFIG_REQUEST, 
    DELETE_ENVIRONMENT_CONFIG_SUCCESS, 
    DELETE_ENVIRONMENT_CONFIG_FAILURE,
    UPDATE_ENVIRONMENT_CONFIG_REQUEST,
    UPDATE_ENVIRONMENT_CONFIG_SUCCESS,
    UPDATE_ENVIRONMENT_CONFIG_FAILURE 
} from "../constants/action_types";
import { UPLOAD_ENVIRONMENT_CONFIG_URL, ENVIRONMENT_CONFIG_DATA_URL, DELETE_ENVIRONMENT_CONFIG_DATA_URL, UPDATE_ENVIRONMENT_CONFIG_DATA_URL } from "../constants/api_endpoints";

export const uploadEnvironmentConfig = (data, callback=()=>{})=>{
    return genericRequest({
        request_action: UPLOAD_ENVIRONMENT_CONFIG_REQUEST,
        success_action: UPLOAD_ENVIRONMENT_CONFIG_SUCCESS,
        failure_action: UPLOAD_ENVIRONMENT_CONFIG_FAILURE,
        callback: callback,
        requestMethod: apiHttpPOST,
        endpoint: UPLOAD_ENVIRONMENT_CONFIG_URL,
        requestBody: data
    });
}

export const getEnvironmentConfig = (callback=()=>{})=>{
    return genericRequest({
        request_action: FETCH_ENVIRONMENT_CONFIG_REQUEST,
        success_action: FETCH_ENVIRONMENT_CONFIG_SUCCESS,
        failure_action: FETCH_ENVIRONMENT_CONFIG_FAILURE,
        callback: callback,
        requestMethod: apiHttpGET,
        endpoint: ENVIRONMENT_CONFIG_DATA_URL
    });
}

export const deleteEnvironmentConfig = (deleteId, callback=()=>{})=>{
    return genericRequest({
        request_action: ()=>({type:DELETE_ENVIRONMENT_CONFIG_REQUEST, payload: deleteId}),
        success_action: DELETE_ENVIRONMENT_CONFIG_SUCCESS,
        failure_action: DELETE_ENVIRONMENT_CONFIG_FAILURE,
        callback: callback,
        requestMethod: apiHttpGET,
        dynamicParams: { id: deleteId },
        endpoint: DELETE_ENVIRONMENT_CONFIG_DATA_URL
    });
}

export const updateEnvironmentConfig = (data, callback=()=>{})=>{
    return genericRequest({
        request_action: UPDATE_ENVIRONMENT_CONFIG_REQUEST,
        success_action: UPDATE_ENVIRONMENT_CONFIG_SUCCESS,
        failure_action: UPDATE_ENVIRONMENT_CONFIG_FAILURE,
        callback: callback,
        requestMethod: apiHttpPOST,
        requestBody: data,
        endpoint: UPDATE_ENVIRONMENT_CONFIG_DATA_URL
    });
}