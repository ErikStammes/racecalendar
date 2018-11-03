import apiClient from "../../utils/apiClient";

export const LOGIN = 'LOGIN'
export const LOGIN_FULFILLED = 'LOGIN_FULFILLED'
export const LOGIN_REJECTED = 'LOGIN_REJECTED'


export function login(username, password) {
    return function(dispatch) {
        dispatch({type: LOGIN})

        const client = apiClient()

        client.post(`/login`, { username, password})
            .then((response) => {
                sessionStorage.setItem('jwt', response.data.token)
                dispatch({type: LOGIN_FULFILLED, payload: response.data})
            })
            .catch((err) => {
                dispatch({type: LOGIN_REJECTED, payload: err})
            })
    }
}

export const FETCH_ME = 'FETCH_ME'
export const FETCH_ME_FULFILLED = 'FETCH_ME_FULFILLED'
export const FETCH_ME_REJECTED = 'FETCH_ME_REJECTED'

export function fetchMe() {
    return function(dispatch) {
        dispatch({type: FETCH_ME})

        const client = apiClient(sessionStorage.jwt)

        client.get(`/me`)
            .then((response) => {
                dispatch({type: FETCH_ME_FULFILLED, payload: response.data})
            })
            .catch((err) => {
                dispatch({type: FETCH_ME_REJECTED, payload: err})
            })
    }
}

export const REGISTER = 'REGISTER'
export const REGISTER_FULFILLED = 'REGISTER_FULFILLED'
export const REGISTER_REJECTED = 'REGISTER_REJECTED'

export function register(name, email, password, token) {
    return function(dispatch) {
        dispatch({type: REGISTER})

        const client = apiClient()

        client.post(`/register`, {name, email, password, token})
            .then((response) => {
                dispatch({type: REGISTER_FULFILLED, payload: response.data})
            })
            .catch((err) => {
                dispatch({type: REGISTER_REJECTED, payload: err})
            })

    }
}

export const LOGOUT = 'LOGOUT'
export const LOGOUT_FULFILLED = 'LOGOUT_FULFILLED'
export const LOGOUT_REJECTED = 'LOGOUT_REJECTED'

export function logout() {
    return function(dispatch) {
        dispatch({type: LOGOUT})
        dispatch({type: LOGOUT_FULFILLED})
    }
}
