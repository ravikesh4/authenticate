import React, { useState } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css'
import Layout from '../core/Layout';
import { isAuth } from './Helper';

const Signup = () => {

    const [values, setValues] = useState({
        name: "",
        email: "",
        password: "",
        role: "",
        buttonText: "Submit"
    })

    const { name, email, password, role, buttonText } = values;

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
            url: `${process.env.REACT_APP_API}/signup`,
            data: { name, email, password, role }
        })
        // console.log(values)
            .then(response => {
                console.log('Signup Success', response)
                setValues({ ...values, name: '', email: '', password: '', role:'', buttonText: 'Submitted' })
                toast.success(response.data.message)
            })
            .catch(error => {
                console.log('Signup error', error.response.data)
                setValues({ ...values, buttonText: 'Submit' })
                toast.error(error.response.data.error)
            })
    }

    const signupForm = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input onChange={handleChange('name')} value={name} type="text" className="form-control" />
            </div>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input onChange={handleChange('email')} value={email} type="email" className="form-control" />
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input onChange={handleChange('password')} value={password} type="password" className="form-control" />
            </div>
                <h6>What you want to be?</h6>
            <div className="form-group container row">
                <div className="form-check col-6">
                    <input className="form-check-input" onChange={handleChange('role')} type="radio" name="exampleRadios" id="client" value={`client`} checked={role === 'client'} />
                    <label className="form-check-label" htmlFor="client">
                        Client
                    </label>
                </div>
                <div className="form-check col-6">
                    <input className="form-check-input" onChange={handleChange('role')} type="radio" name="exampleRadios" id="vendor" value={`vendor`} checked={role === 'vendor'} />
                    <label className="form-check-label" htmlFor="vendor">
                        Vendor
                </label>
                </div>
            </div>
            <div>
                <button className="btn btn-primary" onClick={clickSubmit}>{buttonText}</button>
            </div>
        </form>
    )

    return (
        <Layout>
            <div className="col-md-6 offset-md-3">
                <ToastContainer />
                {/* {JSON.stringify({ name, email, password })} */}
                {isAuth() ? <Redirect to="/" /> : null}
                <h1 className="p-5 text-center">Signup</h1>
                {signupForm()}
                <br />
                <Link to="/auth/password/forgot" className="btn btn-sm btn-outline-danger">Forgot Password?</Link>
            </div>
        </Layout>
    )
}


export default Signup;
