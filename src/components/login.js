import React from 'react';
import './login.css'

const Login = (props) => {

    const { email,
        setEmail,
        password,
        setPassword,
        handleLogin,
        handleSignup,
        hasAccount,
        setHasAccount,
        emailError,
        passwordError
    } = props

    return (
        <div className="box">
            <h1>Welcome TO Chat Support</h1>
            <input type="text" autoFocus required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <p className='errorMsg'>{emailError}</p>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <p className='errorMsg'>{passwordError}</p>
            <div className='btnContainer'>

                {hasAccount ? (
                    <>
                        <button type='signupbutton' onClick={handleSignup}>SignUp</button>
                        <p>Have an account ? <span onClick={() => setHasAccount(!hasAccount)}>Login</span></p>

                    </>) : (
                    <>
                        <button type='loginbutton' onClick={handleLogin}>Login</button>
                        <p>Don't have an account ? <span onClick={() => setHasAccount(!hasAccount)}>Signup</span></p>

                    </>)}

            </div>
        </div>
    )
}

export default Login