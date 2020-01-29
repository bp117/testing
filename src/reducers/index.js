import counter from './counter.js'
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    counter
});

export default rootReducer;