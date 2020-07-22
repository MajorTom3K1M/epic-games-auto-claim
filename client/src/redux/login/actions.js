import { LOGIN } from './actionType'

export const userDispatch = (email) => {
    return async dispatch => {
        dispatch({ type: LOGIN, email })
    }
}