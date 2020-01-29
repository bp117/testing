import { createReducer } from '../utils/misc';
import{
    UPLOAD_COMPONENT_DEFINITION_REQUEST,
    UPLOAD_COMPONENT_DEFINITION_SUCCESS,
    UPLOAD_COMPONENT_DEFINITION_FAILURE,
    FETCH_COMPONENT_DEFINITION_REQUEST,
    FETCH_COMPONENT_DEFINITION_SUCCESS,
    FETCH_COMPONENT_DEFINITION_FAILURE
} from "../constants/action_types";

const initialState = {
    isUploadingComponent: false,
    isUploadedComponent: false,
    isFetchingComponent: false,
    isLoadedComponent: false,
    components: []
}

export default createReducer(initialState, {
    [UPLOAD_COMPONENT_DEFINITION_REQUEST]: (state)=>({
        ...state,
        isUploadingComponentDef: true,
        isUploadedComponentDef: false
    }),
    [UPLOAD_COMPONENT_DEFINITION_SUCCESS]: (state)=>({
        ...state,
        isUploadingComponentDef: false,
        isUploadedComponentDef: true
    }),
    [UPLOAD_COMPONENT_DEFINITION_FAILURE]: (state)=>({
        ...state,
        isUploadingComponentDef: false,
        isUploadedComponentDef: false
    }),
    [FETCH_COMPONENT_DEFINITION_REQUEST]: (state)=>({
        ...state,
        isFetchingComponent: true,
        isLoadedComponent: false
    }),
    [FETCH_COMPONENT_DEFINITION_SUCCESS]: (state, data=[])=>({
        ...state,
        isFetchingComponent: false,
        isLoadedComponent: true,
        components: data
    }),
    [FETCH_COMPONENT_DEFINITION_FAILURE]: (state)=>({
        ...state,
        isFetchingComponent: false,
        isLoadedComponent: false
    })
});