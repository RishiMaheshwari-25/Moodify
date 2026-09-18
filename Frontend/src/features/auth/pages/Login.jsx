import React from 'react'
import "../style/login.scss"
import FormGroup from '../componenets/Formgroup'
import { Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router'
import { useState } from 'react'


const Login = () => {
    const {user,loading,handleLogin}=useAuth()
    const [email,setEmail]=useState("")
    const [password,setPassword] =useState("")
    const navigate=useNavigate()
    async function handleSubmit(e){
        e.preventDefault()
        await handleLogin({email,password})
        navigate("/")

    }
  return (
<main className="login-page">
    <div className="form-conatiner">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
            <FormGroup 
            value={email}
            onChange={(e)=>{setEmail(e.target.value)}}
            label="email" placeholder="Enter your email"/>
            <FormGroup
            value={password}
            onChange={(e)=>{setPassword(e.target.value)}}
             label="password" placeholder="Enter your password"/>
            <button type="submit">Login</button>
        </form>
          <p>Doesn't have an Account? <Link to="/register">Create Account</Link></p>
    </div>
</main>
  )
}

export default Login
