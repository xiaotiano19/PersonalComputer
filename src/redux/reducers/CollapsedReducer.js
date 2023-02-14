import * as constants from './../constants'
export const CollapsedReducer = (prevState = { isCollapsed: false }, action) => {
    switch (action.type) {
        case constants.CHANGE_COLLAPSED:
            return { isCollapsed: !prevState.isCollapsed }
        default:
            return prevState
    }

}