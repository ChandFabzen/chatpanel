import React, { useEffect, useState } from 'react';
import "./App.css";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { auth } from '../src/services/firebase'
import Nav from "./components/header";
import Middle from "./components/middleComponent";
import { BrowserRouter } from "react-router-dom";
import Login from "./components/login";




function App() {

  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [hasAccount, setHasAccount] = useState(false);


  const clearInputs = () => {
    setEmail('')
    setPassword('')
  }

  const clearError = () => {
    setEmailError('')
    setPasswordError('')
  }

  const handleLogin = () => {
    clearError()
    signInWithEmailAndPassword(auth, email, password)
      .catch((err) => {
        switch (err.code) {
          case "auth/invalid-email":
          case "auth/user-disabled":
          case "auth/user-not-found":
            setEmailError(err.message);
            break;
          case "auth/weak-password":
            setPasswordError(err.message)
            break;
          default:
            break;
        }
      })
  }

  const handleSignup = () => {
    clearError()
    createUserWithEmailAndPassword(auth, email, password)
      .catch((err) => {
        switch (err.code) {
          case "auth/email-already-in-use":
          case "auth/invalid-email":
            setEmailError(err.message);
            break;
          case "auth/weak-password":
            setPasswordError(err.message)
            break
          default:
            break
        }
      })
  }

  const handleLogout = () => {
    signOut(auth)
  }

  const authListener = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        clearInputs()
        setUser(user)
      } else {
        setUser('')
      }
    })
  }

  useEffect(() => {
    authListener()
  })

  const ChatBox = () => {
    return (
      <div className="chatContainer">
        <Nav handleLogout={handleLogout} />
        <Middle />
      </div>
    )
  }

  return (
    <div className="App">
      <BrowserRouter>
        {
          user ? (<>
            <ChatBox />
          </>) : (
            <><Login
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              handleLogin={handleLogin}
              handleSignup={handleSignup}
              hasAccount={hasAccount}
              setHasAccount={setHasAccount}
              emailError={emailError}
              passwordError={passwordError} />
            </>)
        }
      </BrowserRouter>
    </div>
  );
}

export default App;


