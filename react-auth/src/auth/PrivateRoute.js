import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isAuth } from './Helper';

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={
        props => isAuth() && isAuth().role === 'vendor' ? <Component {...props} /> : <Redirect to={{ pathname: '/signin', state: { from: props.location } }} />
    }></Route>
)

export default PrivateRoute;