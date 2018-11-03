import { createStore, combineReducers, applyMiddleware } from 'redux'
import calendar from './reducers/calendar'
import login from './reducers/login'

import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'

const store = createStore(
    combineReducers({
        login: login,
        calendar: calendar
    }),
    applyMiddleware(thunk, createLogger())
)

export default store