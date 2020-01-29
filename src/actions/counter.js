import{
    INCREMENT_COUNTER,
    DECREMENT_COUNTER
} from "../constants/action_types";

function createAction(type, payload){
    return {type, payload}
}

export function incrementCounter(amount){
    return (dispatch)=>{
        dispatch(createAction(INCREMENT_COUNTER, amount))
    }
}

export function decrementCounter(amount){
    return (dispatch)=>{
        dispatch(createAction(DECREMENT_COUNTER, amount))
    }
}