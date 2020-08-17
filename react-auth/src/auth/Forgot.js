import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css'
import Layout from '../core/Layout';

const Forgot = ({history}) => {

    const [values, setValues] = useState({
        email: "",
        buttonText: "Request password rest link"
    })

    const { email, buttonText } = values;

    const handleChange = (name) => (event) => {
        //
        // console.log(event.target.value);
        setValues({ ...values, [name]: event.target.value })
    }

    const clickSubmit = (event) => {
        //
        event.preventDefault();
        setValues({ ...values, buttonText: 'Submitting' })
        // console.log('Send request');
        axios({
            method: 'PUT',
            url: `${process.env.REACT_APP_API}/forgot-password`,
            data: { email }
        })
            .then(response => {
                console.log('Forgot password Success', response)
                toast.success(response.data.message)
                setValues({...values, buttonText: 'Requested'})
            })
            .catch(error => {
                console.log('Forgot password error', error.response.data)
                toast.error(error.response.data.error)
                setValues({ ...values, buttonText: 'Request password rest link' })
            })
    }

    const passwordForgotForm = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input onChange={handleChange('email')} value={email} type="email" className="form-control" />
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
                {/* {JSON.stringify({ name, email, password })} */}
                <h1 className="p-5 text-center">Forget Password</h1>
                {passwordForgotForm()}
            </div>
        </Layout>
    )
}


export default Forgot;
