import React, { useState } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import { authenticate, isAuth } from './Helper'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css'
import Layout from '../core/Layout';

const Signin = ({history}) => {

    const [values, setValues] = useState({
        email: "ourprojects079@gmail.com",
        password: "123456",
        buttonText: "Submit"
    })

    const { email, password, buttonText } = values;

    const handleChange = (name) => (event) => {
        //
        // console.log(event.target.value);
        setValues({ ...values, [name]: event.target.value })
    }

    const clickSubmit = (event) => {
        //
        event.preventDefault();
        setValues({ ...values, buttonText: 'Submitting' })
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_API}/signin`,
            data: { email, password }
        })
            .then(response => {
                console.log('Signin Success', response)

                // save the response (user , token) localStorage and cookies 
                authenticate(response, () => {
                    setValues({ ...values, email: '', password: '', buttonText: 'Submitted' })
                    // toast.success(`Hey ${response.data.user.name}, Welcome back!`)
                    isAuth() && isAuth().role === 'admin' ? history.push('/admin') : history.push('private')
                })
            })
            .catch(error => {
                console.log('Signin error', error.response.data)
                setValues({ ...values, buttonText: 'Submit' })
                toast.error(error.response.data.error)
            })
    }

    const signinForm = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input onChange={handleChange('email')} value={email} type="email" className="form-control" />
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input onChange={handleChange('password')} value={password} type="password" className="form-control" />
            </div>

            <div>
                <button className="btn btn-primary" onClick={clickSubmit}>{buttonText}</button>
            </div>
        </form>
    )

    return (
        <Layout>
            {/* {JSON.stringify(isAuth())} */}
            <div className="col-md-6 offset-md-3">
                <ToastContainer />
                {isAuth() ? <Redirect to="/" /> : null}
                {/* {JSON.stringify({ name, email, password })} */}
                <h1 className="p-5 text-center">Signin</h1>
                {signinForm()}
            </div>
        </Layout>
    )
}


export default Signin;
