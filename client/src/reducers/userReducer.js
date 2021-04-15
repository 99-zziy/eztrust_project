import {
    LOGIN_USER, SIGNUP_USER, AUTH_USER, ID_CHECK, LOGOUT_USER
} from "../actions/types"

export default function (state = {}, action) {

    console.log(`userReducer action.type: ${action.type}`)

    switch (action.type) {
        case LOGIN_USER:
            return {...state, login: action.payload}
        case SIGNUP_USER:
            return {...state, signup: action.payload}
        case AUTH_USER:
            return {...state, auth: action.payload}
        case ID_CHECK:
            return {...state, idCheck: action.payload}
        case LOGOUT_USER:
            return {...state, logout: action.payload}
        default:
            return state
    }
}