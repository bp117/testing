import { combineReducers } from 'redux';
import components from './components'
import environments from './environment'

const rootReducer = combineReducers({
    components,
    environments
});

export default rootReducer;