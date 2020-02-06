import { createReducer } from '../utils/misc';
import{
    FETCH_EXPERIMENT_JSON_REQUEST,
    FETCH_EXPERIMENT_JSON_SUCCESS,
    FETCH_EXPERIMENT_JSON_FAILURE,
    FETCH_FINAL_EXPERIMENT_JSON_REQUEST,
    FETCH_FINAL_EXPERIMENT_JSON_SUCCESS,
    FETCH_FINAL_EXPERIMENT_JSON_FAILURE,
    FETCH_EXPERIMENT_RUN_HISTORY_REQUEST,
    FETCH_EXPERIMENT_RUN_HISTORY_SUCCESS,
    FETCH_EXPERIMENT_RUN_HISTORY_FAILURE
} from "../constants/action_types";

const initialState = {
    isFetchingExperiment: false,
    isFetchingRunHistory: false,
    isLoadedExperiment: false,
    experiments: [],
    finalExperiments: [],
    runHistory: []
}

export default createReducer(initialState, {
    [FETCH_EXPERIMENT_JSON_REQUEST]: (state)=>({
        ...state,
        isFetchingExperiment: true,
        isLoadedExperiment: false
    }),
    [FETCH_EXPERIMENT_JSON_SUCCESS]: (state, payload)=>({
        ...state,
        isFetchingExperiment: false,
        isLoadedExperiment: true,
        experiments: payload.filter(item=>!item.experimentStatus),
        readyExperiments: payload.filter(item=>item.experimentStatus),
        executedExperiments: payload.filter(item=>item.experimentStatus === "EXECUTED")
    }),
    [FETCH_EXPERIMENT_JSON_FAILURE]: (state)=>({
        ...state,
        isFetchingExperiment: false,
        isLoadedExperiment: false
    }),
    [FETCH_FINAL_EXPERIMENT_JSON_REQUEST]: (state)=>({
        ...state,
        isFetchingExperiment: true,
        isLoadedExperiment: false
    }),
    [FETCH_FINAL_EXPERIMENT_JSON_SUCCESS]: (state, payload)=>({
        ...state,
        isFetchingExperiment: false,
        isLoadedExperiment: true,
        finalExperiments: payload
    }),
    [FETCH_FINAL_EXPERIMENT_JSON_FAILURE]: (state)=>({
        ...state,
        isFetchingExperiment: false,
        isLoadedExperiment: false
    }),

    [FETCH_EXPERIMENT_RUN_HISTORY_REQUEST]: (state)=>({
        ...state,
        isFetchingRunHistory: true
    }),

    [FETCH_EXPERIMENT_RUN_HISTORY_SUCCESS]: (state, payload)=>({
        ...state,
        isFetchingRunHistory: false,
        runHistory: payload
    }),

    [FETCH_EXPERIMENT_RUN_HISTORY_FAILURE]: (state)=>({
        ...state,
        isFetchingRunHistory: false
    })
});