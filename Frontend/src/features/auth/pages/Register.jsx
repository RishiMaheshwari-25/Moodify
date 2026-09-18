import React from 'react'
import "../style/register.scss"
import FormGroup from '../componenets/Formgroup'
import { Link } from 'react-router'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router'
const Register = () => {
    const [username,setUsername]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const {loading,handleRegister}=useAuth()
    const navigate=useNavigate()
    async function handleSubmit(e){
        e.preventDefault()
        await handleRegister({username,email,password})
        navigate("/")

}
  return (
    <main className="register-page">
        <div className="form-conatiner">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
            <FormGroup 
            value={username}
            onChange={(e)=>{setUsername(e.target.value)}}
             type="text"label="name" placeholder="Enter your name"/>
            <FormGroup
            value={email}
            onChange={(e)=>{setEmail(e.target.value)}}
            type="email" label="email" placeholder="Enter your email"/>
            <FormGroup 
            value={password}
            onChange={(e)=>{setPassword(e.target.value)}}
             type="text"label="password" placeholder="Enter your password"/>
            <button type="submit">Create Account</button>
        </form>
        <p>Already have an Account? <Link to="/login">Login Here</Link></p>

    </div>
    </main>
  )
}

export default Register
