import {
    FETCH_RACES,
    FETCH_RACES_FULFILLED,
    FETCH_RACES_REJECTED,
    ADD_PARTICIPANT,
    ADD_PARTICIPANT_FULFILLED,
    ADD_PARTICIPANT_REJECTED,
    ADD_RACE,
    ADD_RACE_FULFILLED,
    ADD_RACE_REJECTED,
    REMOVE_PARTICIPANT,
    REMOVE_PARTICIPANT_FULFILLED,
    REMOVE_PARTICIPANT_REJECTED
} from '../actions/calendar'

const INITIAL_STATE = {
    races: null,
    error: null,
    loading: false,
    raceAdded: false
}

export default function reducer (state = INITIAL_STATE, action) {
    const { type, payload } = action
    switch(type) {
        case FETCH_RACES: {
            return {...state, loading: true, raceAdded: false}
        }
        case FETCH_RACES_FULFILLED: {
            return {...state, races: payload, loading: false, error: null}
        }
        case FETCH_RACES_REJECTED: {
            return {...state, loading: false, error: payload}
        }
        case ADD_PARTICIPANT: {
            return state //loading: true?
        }
        case ADD_PARTICIPANT_FULFILLED: {
            return {
                ...state, 
                races: state.races.map(race => race._id === payload._id ? payload : race),
                error: null
            }
        }
        case ADD_PARTICIPANT_REJECTED: {
            return {...state, error: payload }
        }
        case ADD_RACE: {
            return {...state}
        }
        case ADD_RACE_FULFILLED: {
            return {
                ...state,
                error: null,
                raceAdded: true
            }
        }
        case ADD_RACE_REJECTED: {
            return {...state, error: payload }
        }
        case REMOVE_PARTICIPANT: {
            return state
        }
        case REMOVE_PARTICIPANT_FULFILLED: {
            return {
                ...state,
                races: state.races.map(race => race._id === payload._id ? payload: race),
                error: null
            }
        }
        case REMOVE_PARTICIPANT_REJECTED: {
            return {...state, error: payload}
        }
        default:
            return state
    }
}