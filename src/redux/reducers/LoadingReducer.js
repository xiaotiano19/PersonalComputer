import * as constants from './../constants'
export const LoadingReducer = (prevState = { isLoading: false }, action) => {
    switch (action.type) {
        case constants.CHANGE_LOADING:
            return { isloading: action.payload }
        default:
            return prevState
    }

}