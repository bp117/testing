import { combineReducers } from 'redux';
import components from './components'
import environments from './environment';
import experiments from './experiments';

const rootReducer = combineReducers({
    components,
    environments,
    experiments
});

export default rootReducer;