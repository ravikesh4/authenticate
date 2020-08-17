import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwt from 'jsonwebtoken'
// import { Link, Redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css'
import Layout from '../core/Layout';

const Activate = ({match}) => {

    const [values, setValues] = useState({
        name: "",
        token: "",
        show: true,
    })

    const { name, token } = values;

    useEffect(() => {
        // console.log('Change');
        let token = match.params.token;
        let {name} = jwt.decode(token)
        // console.log(token);
        if(token) {
            setValues({...values, name, token})
            
        }
    }, [])

    const clickSubmit = (event) => {
        //
        event.preventDefault();
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_API}/account-activation`,
            data: { token }
        })
            .then(response => {
                console.log('Account Activation', response)
                setValues({ ...values, show: false })
                toast.success(response.data.message)
            })
            .catch(error => {
                console.log('Account Activation Error', error.response.data.error)
                toast.error(error.response.data.error)
            })
    }

    const activationLink = () => (
        <div className="text-center">
            <h1 className="p-5 text-center">Hey {name}, Ready to activate your account</h1>
            <button className="btn btn-primary" onClick={clickSubmit}>Activate Account</button>
        </div>
    )

    return (
        <Layout>
            <div className="col-md-6 offset-md-3">
                <ToastContainer />
                {/* {JSON.stringify({ name, email, password })} */}
                {activationLink()}
            </div>
        </Layout>
    )
}


export default Activate;
