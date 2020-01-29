import { createReducer } from '../utils/misc';
import{
    INCREMENT_COUNTER,
    DECREMENT_COUNTER
} from "../constants/action_types";

const initialState = {
    counts: 0
}

export default createReducer(initialState, {
    [INCREMENT_COUNTER]: (state, amount=0)=>({
        ...state,
        counts: amount? state.counts + amount : state.counts + 1
    }),

    [DECREMENT_COUNTER]: (state, amount=0)=>({
        ...state,
        counts: amount? state.counts - amount : state.counts - 1
    })
});