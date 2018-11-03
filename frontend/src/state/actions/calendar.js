import apiClient from "../../utils/apiClient";

export const FETCH_RACES = 'FETCH_RACES'
export const FETCH_RACES_FULFILLED = 'FETCH_RACES_FULFILLED'
export const FETCH_RACES_REJECTED = 'FETCH_RACES_REJECTED'

export function fetchRaces() {
    return function(dispatch) {
        dispatch({type: FETCH_RACES})

        const client = apiClient(sessionStorage.jwt)

        client.get(`/races`)
            .then((response) => {
                dispatch({type: FETCH_RACES_FULFILLED, payload: response.data})
            })
            .catch((err) => {
                dispatch({type: FETCH_RACES_REJECTED, payload: err})
            })
    }
}

export const ADD_PARTICIPANT = 'ADD_PARTICIPANT'
export const ADD_PARTICIPANT_FULFILLED = 'ADD_PARTICIPANT_FULFILLED' 
export const ADD_PARTICIPANT_REJECTED = 'ADD_PARTICIPANT_REJECTED'

export function addParticipant(raceId, registered) {
    return function(dispatch) {
        dispatch({type: ADD_PARTICIPANT})

        const client = apiClient(sessionStorage.jwt)
        const url = `/race/${raceId}/register/` + (registered ? `true` : `false`)
        client.post(url)
            .then((response) => {
                dispatch({type: ADD_PARTICIPANT_FULFILLED, payload: response.data})
            })
            .catch((err) => {
                dispatch({type: ADD_PARTICIPANT_REJECTED, payload: err})
            })
    }
}

export const REMOVE_PARTICIPANT = 'REMOVE_PARTICIPANT'
export const REMOVE_PARTICIPANT_FULFILLED = 'REMOVE_PARTICIPANT_FULFILLED'
export const REMOVE_PARTICIPANT_REJECTED = 'REMOVE_PARTICIPANT_REJECTED'

export function removeParticipant(raceId, registered) {
    return function(dispatch) {
        dispatch({type: ADD_PARTICIPANT})

        const client = apiClient(sessionStorage.jwt)
        const url = `/race/${raceId}/register/` + (registered ? `true` : `false`)
        client.delete(url)
            .then((response) => {
                dispatch({type: ADD_PARTICIPANT_FULFILLED, payload: response.data})
            })
            .catch((err) => {
                dispatch({type: ADD_PARTICIPANT_REJECTED, payload: err})
            })
    }
}

export const ADD_RACE = 'ADD_RACE'
export const ADD_RACE_FULFILLED = 'ADD_RACE_FULFILLED'
export const ADD_RACE_REJECTED = 'ADD_RACE_REJECTED'

export function addRace(race) {
    return function(dispatch) {
        dispatch({type: ADD_RACE})

        const client = apiClient(sessionStorage.jwt)
        client.post('/race', race)
            .then((response) => {
                dispatch({type: ADD_RACE_FULFILLED, payload: response.data})
            })
            .catch((err) => {
                dispatch({type: ADD_RACE_REJECTED, payload: err})
            })
    }
}
