import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import { Link, Redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css'
import Layout from '../core/Layout';
import { isAuth, getCookie, signout, updateUser } from '../auth/Helper';


const Client = ({ history }) => {

    const [values, setValues] = useState({
        role: '',
        name: '',
        email: '',
        password: '',
        buttonText: "Submit"
    })

    const token = getCookie('token')

    useEffect(() => {
        loadProfile()
    }, [])

    const loadProfile = () => {
        axios({
            method: 'GET',
            url: `${process.env.REACT_APP_API}/user/${isAuth()._id}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                console.log('Client Profile update', response);
                const { role, name, email } = response.data;
                setValues({ ...values, role, name, email })
            })
            .catch(error => {
                console.log('Profile Update error', error);
                if (error.response.status === 401) {
                    signout(() => {
                        history.push('/')
                    })
                }
            })
    }

    const { role, name, email, password, buttonText } = values;

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
            method: 'put',
            url: `${process.env.REACT_APP_API}/user/update`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: { name, password }
        })
            .then(response => {
                console.log('Private Profile Update Success', response)
                updateUser(response, () => {
                    setValues({ ...values, buttonText: 'Submitted' })
                    toast.success('Profile Updated Successfully')
                })
            })
            .catch(error => {
                console.log('Private Profile update error', error.response.data.error)
                setValues({ ...values, buttonText: 'Submit' })
                toast.error(error.response.data.error)
            })
    }

    const updateForm = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Role</label>
                <input defaultValue={role} type="text" className="form-control" disabled />
            </div>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input onChange={handleChange('name')} value={name} type="text" className="form-control" />
            </div>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input defaultValue={email} type="email" className="form-control" disabled />
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
            <div className="col-md-6 offset-md-3">
                <ToastContainer />
                {/* {JSON.stringify({ name, email, password })} */}
                <h1 className="pt-5 text-center">Client</h1>
                <p className="lead text-center">Profile Update</p>
                {updateForm()}
            </div>
        </Layout>
    )
}


export default Client;
