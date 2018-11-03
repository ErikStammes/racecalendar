import {
    LOGIN,
    LOGIN_FULFILLED,
    LOGIN_REJECTED,
    FETCH_ME,
    FETCH_ME_FULFILLED,
    FETCH_ME_REJECTED,
    REGISTER,
    REGISTER_FULFILLED,
    REGISTER_REJECTED,
    LOGOUT,
    LOGOUT_FULFILLED,
    LOGOUT_REJECTED
} from '../actions/login'

const INITIAL_STATE = {
    session: false,
    error: null,
    loading: false,
    user: null,
    registered: false
}

export default function reducer (state = INITIAL_STATE, action) {
    const {type, payload} = action
    switch(type) {
        case LOGIN: {
            return {...state, loading: true}
        }
        case LOGIN_FULFILLED: { 
            return {...state, loading: false, error: null, session: true, user: payload.user}
        }
        case LOGIN_REJECTED: {
            return {...state, loading: false, error: payload, session: false, user: null}
        }
        case FETCH_ME: {
            return {...state, loading: true}
        }
        case FETCH_ME_FULFILLED: {
            return {...state, loading: false, error: null, session: true, user: payload.user}
        }
        case FETCH_ME_REJECTED: {
            return {...state, loading: false, error: payload, session: false, user: null}
        }
        case REGISTER: {
            return state
        }
        case REGISTER_FULFILLED: {
            return {...state, registered: true, error: null}
        }
        case REGISTER_REJECTED: {
            return {...state, registered: false, error: payload}
        }
        case LOGOUT: {
            return {...state, loading: true}
        }
        case LOGOUT_FULFILLED: {
            return {...state, loading: false, error: null, session: false, user: null}
        }
        case LOGOUT_REJECTED: {
            return {...state, loading: false, error: payload}
        }
        default:
            return state
    }
}
