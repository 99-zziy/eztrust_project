import axios from "axios"
import {
    LOGIN_USER, SIGNUP_USER, AUTH_USER, ID_CHECK, LOGOUT_USER
} from './types'

//로그인
export async function loginUser(dataToSubmit) {

    const response = await axios.post('/api/users/login', dataToSubmit)
    return {
        type: LOGIN_USER, payload: response.data, status: response.status
    }
}

//회원가입
export async function signUpUser(dataToSubmit) {

    const response = await axios.post('/api/users/sign_up', dataToSubmit)
    return {
        type: SIGNUP_USER, payload: response.data, status: response.status
    }
}

//인증
export async function auth() {

    const response = await axios.get('/api/users/auth')
    return {
        type: AUTH_USER, payload: response.data, status: response.status
    }

}

//아이디 중복체크
export async function checkDuplicateId(dataTosubmit) {

    const response = await axios.post('/api/users/id_check', dataTosubmit)
    return {
        type: ID_CHECK, payload: response.data, status: response.status
    }
}

//로그아웃
export async function logoutUser() {

    const response = await axios.get('/api/users/logout')
    return {
        type: LOGOUT_USER, payload: response.data, status: response.status
    }
}

