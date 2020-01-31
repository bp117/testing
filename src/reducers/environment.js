import { createReducer } from '../utils/misc';
import{
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

const initialState = {
    isUploadingEnvironment: false,
    isUploadedEnvironment: false,
    isFetchingEnvironment: false,
    isLoadedEnvironment: false,
    isDeletingId: null,
    isUpdatingEnvironment: false,
    isUpdatedEnvironment: false,
    environments: []
}

export default createReducer(initialState, {
    [UPLOAD_ENVIRONMENT_CONFIG_REQUEST]: (state)=>({
        ...state,
        isUploadingEnvironmentDef: true,
        isUploadedEnvironmentDef: false
    }),
    [UPLOAD_ENVIRONMENT_CONFIG_SUCCESS]: (state)=>({
        ...state,
        isUploadingEnvironmentDef: false,
        isUploadedEnvironmentDef: true
    }),
    [UPLOAD_ENVIRONMENT_CONFIG_FAILURE]: (state)=>({
        ...state,
        isUploadingEnvironmentDef: false,
        isUploadedEnvironmentDef: false
    }),
    [FETCH_ENVIRONMENT_CONFIG_REQUEST]: (state)=>({
        ...state,
        isFetchingEnvironment: true,
        isLoadedEnvironment: false
    }),
    [FETCH_ENVIRONMENT_CONFIG_SUCCESS]: (state, data=[])=>({
        ...state,
        isFetchingEnvironment: false,
        isLoadedEnvironment: true,
        environments: data
    }),
    [FETCH_ENVIRONMENT_CONFIG_FAILURE]: (state)=>({
        ...state,
        isFetchingEnvironment: false,
        isLoadedEnvironment: false
    }),
    [DELETE_ENVIRONMENT_CONFIG_REQUEST]: (state, id)=>({
        ...state,
        isDeletingId: id
    }),
    [DELETE_ENVIRONMENT_CONFIG_SUCCESS]: (state, data=[])=>({
        ...state,
        isDeletingId: null
    }),
    [DELETE_ENVIRONMENT_CONFIG_FAILURE]: (state)=>({
        ...state,
        isDeletingId: null
    }),
    [UPDATE_ENVIRONMENT_CONFIG_REQUEST]: (state)=>({
        ...state,
        isUpdatingEnvironment: true,
        isUpdatedEnvironment: false
    }),
    [UPDATE_ENVIRONMENT_CONFIG_SUCCESS]: (state)=>({
        ...state,
        isUpdatingEnvironment: false,
        isUpdatedEnvironment: true
    }),
    [UPDATE_ENVIRONMENT_CONFIG_FAILURE]: (state)=>({
        ...state,
        isUpdatingEnvironment: false,
        isUpdatedEnvironment: false
    })
});