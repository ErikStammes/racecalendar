import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from  'react-redux'
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom'
import './index.css';
import App from './App';
import store from './state/store'
import './config/config'
import Login from './Login'
import Register from './Register'
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <Provider store={store}>
        <HashRouter>
            <Switch>
                <Route exact path="/login" name="Login Page" component={Login}/>
                <Route exact path='/register' name="Registreren" component={Register}/>
                <Route 
                    path="/" 
                    name="Home" 
                    render={(props) => (
                        !sessionStorage.jwt ? (
                            <Redirect to={{ pathname: '/login'}}/>
                        ) : (
                                <App/>
                        )
                )}/>
            </Switch>
        </HashRouter>
    </Provider>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
