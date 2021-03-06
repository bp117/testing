import { createReducer } from '../utils/misc';
import{
    UPLOAD_COMPONENT_DEFINITION_REQUEST,
    UPLOAD_COMPONENT_DEFINITION_SUCCESS,
    UPLOAD_COMPONENT_DEFINITION_FAILURE,
    FETCH_COMPONENT_DEFINITION_REQUEST,
    FETCH_COMPONENT_DEFINITION_SUCCESS,
    FETCH_COMPONENT_DEFINITION_FAILURE,
    DELETE_COMPONENT_DEFINITION_REQUEST,
    DELETE_COMPONENT_DEFINITION_SUCCESS,
    DELETE_COMPONENT_DEFINITION_FAILURE,
    UPDATE_COMPONENT_DEFINITION_REQUEST,
    UPDATE_COMPONENT_DEFINITION_SUCCESS,
    UPDATE_COMPONENT_DEFINITION_FAILURE
} from "../constants/action_types";

const initialState = {
    isUploadingComponent: false,
    isUploadedComponent: false,
    isFetchingComponent: false,
    isLoadedComponent: false,
    isDeletingId: null,
    isUpdatingComponent: false,
    isUpdatedComponent: false,
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
        components: (data||[]).filter(item=>item.type && item.type.toLowerCase()==="component")
    }),
    [FETCH_COMPONENT_DEFINITION_FAILURE]: (state)=>({
        ...state,
        isFetchingComponent: false,
        isLoadedComponent: false
    }),
    [DELETE_COMPONENT_DEFINITION_REQUEST]: (state, id)=>({
        ...state,
        isDeletingId: id
    }),
    [DELETE_COMPONENT_DEFINITION_SUCCESS]: (state, data=[])=>({
        ...state,
        isDeletingId: null
    }),
    [DELETE_COMPONENT_DEFINITION_FAILURE]: (state)=>({
        ...state,
        isDeletingId: null
    }),
    [UPDATE_COMPONENT_DEFINITION_REQUEST]: (state)=>({
        ...state,
        isUpdatingComponent: true,
        isUpdatedComponent: false
    }),
    [UPDATE_COMPONENT_DEFINITION_SUCCESS]: (state)=>({
        ...state,
        isUpdatingComponent: false,
        isUpdatedComponent: true
    }),
    [UPDATE_COMPONENT_DEFINITION_FAILURE]: (state)=>({
        ...state,
        isUpdatingComponent: false,
        isUpdatedComponent: false
    })
});