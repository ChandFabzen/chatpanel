import React from 'react';
import './login.css'

const Signup = () => {
    return (
        <div className="box">
            <h1>Register</h1>
            <input type="text" name="" placeholder="Name" />
            <input type="email" name="" placeholder="Email" />
            <input type="password" name="" placeholder="Password" />
            <button type="button">Register</button>
        </div>
    )
}

export default Signup