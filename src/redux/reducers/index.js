import { combineReducers } from 'redux'
import { CollapsedReducer } from './CollapsedReducer'
import { LoadingReducer } from './LoadingReducer'
export default combineReducers({
    CollapsedReducer,
    LoadingReducer
})