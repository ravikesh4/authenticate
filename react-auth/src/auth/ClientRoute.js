import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isAuth } from './Helper';

const ClientRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={
        props => isAuth() &&  isAuth().role === 'client' ? <Component {...props} /> : <Redirect to={{ pathname: '/signin', state: { from: props.location } }} />
    }></Route>
)

export default ClientRoute;