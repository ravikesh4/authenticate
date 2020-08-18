import React, { useState } from 'react';
import axios from 'axios';
import { authenticate, isAuth } from './Helper'
import GoogleLogin from 'react-google-login'

const Google = () => {

    const responseGoogle = (response) => {
        console.log(response);
    }

    return (
        <div className="pb-3">
            <GoogleLogin
                clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}
                buttonText="Login"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
            />
        </div>
    )
}

export default Google;