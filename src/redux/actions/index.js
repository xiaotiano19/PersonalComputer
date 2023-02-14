import * as constants from '../constants'
export const changeCollapsed = () => {
    return {
        type: constants.CHANGE_COLLAPSED
    }
}
export const changeLoading = (payload) => {
    return {
        type: constants.CHANGE_LOADING,
        payload
    }
}