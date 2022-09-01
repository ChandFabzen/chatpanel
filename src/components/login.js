import React from 'react';
import './login.css'

const Login = ()=>{
    return(
        <div className="box">
            <h1>Login</h1>
            <input type="text" name="" placeholder="Email" />
            <input type="password" name="" placeholder="Password"/>
            <button type='button'>Login</button>
            <button type='button'>SignUp</button>
        </div>
    )
}

export default Login