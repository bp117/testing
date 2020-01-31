import { SUBMIT_EXPERIMENT_JSON_REQUEST, SUBMIT_EXPERIMENT_JSON_SUCCESS, SUBMIT_EXPERIMENT_JSON_FAILURE } from "../constants/action_types";
import { SUBMIT_EXPERIMENT_JSON_URL } from "../constants/api_endpoints";
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