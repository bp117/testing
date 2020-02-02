import { createReducer } from '../utils/misc';
import{
    FETCH_EXPERIMENT_JSON_REQUEST,
    FETCH_EXPERIMENT_JSON_SUCCESS,
    FETCH_EXPERIMENT_JSON_FAILURE
} from "../constants/action_types";

const initialState = {
    isFetchingExperiment: false,
    isLoadedExperiment: false,
    experiments: []
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
        experiments: payload
    }),
    [FETCH_EXPERIMENT_JSON_FAILURE]: (state)=>({
        ...state,
        isFetchingExperiment: false,
        isLoadedExperiment: false
    })
});