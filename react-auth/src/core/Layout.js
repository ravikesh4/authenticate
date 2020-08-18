import React, { Fragment } from 'react'
import { Link, withRouter } from 'react-router-dom';
import { isAuth, signout } from '../auth/Helper';

const Layout = ({ children, match, history }) => {

    const isActive = path => {
        if (match.path === path) {
            return { color: '#000' }
        } else {
            return { color: '#fff' }
        }
    }

    const nav = () => (
        <ul className="nav nav-tabs bg-primary">
            <li className="nav-item">
                <Link to="/" className="nav-link" style={isActive('/')}>
                    Home
                </Link>
            </li>
            {!isAuth() && (
                <React.Fragment>
                    <li className="nav-item">
                        <Link to="/signin" className="nav-link" style={isActive('/signin')}>
                            Signin
                </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/signup" className="nav-link" style={isActive('/signup')}>
                            Signup
                </Link>
                    </li>
                </React.Fragment>
            )}

            {isAuth() && isAuth().role === 'admin' && (
                <li className="nav-item">
                    <Link className="nav-link" to="/admin" style={{ cursor: 'pointer', color: 'white' }}>{isAuth().name}</Link>
                </li>
            )}
            {isAuth() && isAuth().role === 'vendor' && (
                <li className="nav-item">
                    <Link className="nav-link" to="/private" style={{ cursor: 'pointer', color: 'white' }}>{isAuth().name}</Link>
                </li>
            )}
            {isAuth() && isAuth().role === 'client' && (
                <li className="nav-item">
                    <Link className="nav-link" to="/client" style={{ cursor: 'pointer', color: 'white' }}>{isAuth().name}</Link>
                </li>
            )}

            {isAuth() && (
                <li className="nav-item">
                    <span className="nav-link" style={{ cursor: 'pointer', color: 'white' }} onClick={() => {
                        signout(() => {
                            history.push('/')
                        })
                    }}>Logout</span>
                </li>
            )}

        </ul>
    )

    return (
        <Fragment>
            {nav()}
            <div className="container">
                {children}
            </div>
        </Fragment>
    )
}

export default withRouter(Layout);