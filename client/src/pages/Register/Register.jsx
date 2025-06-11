import React from 'react'
import styled from 'styled-components'
import logo from "../../assets/logo.png"
import { Link } from 'react-router-dom'
import { useState } from 'react'
import {ToastContainer,toast} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import axios from 'axios'
import { registerRoute } from '../../utils/APIRoutes'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function Register() {
 let navigate = useNavigate();

  const [values, setValues] = useState({
    username : "",
    email: "",
    password : "",
    confirmPassword : "",
  });
    const handleSubmit =async(e)=>{
        e.preventDefault();
       if( handleValidation()){
        console.log("in validation", registerRoute)
        const {password, username, email} = values;
        const {data} = await axios.post(registerRoute,{
          username, email, password
        });
        if(data.status===false){
          toast.error(data.msg,toastOptions);
        }
        if(data.status===true){
          localStorage.setItem(`chat-app-user`,JSON.stringify(data.user))
        }
        navigate("/");
       };
    }

    const toastOptions= {
      position: "bottom-right",
      autoClose : 8000,
      pauseOnHover:true,
      draggable:true,
      theme : "dark"
    }

    useEffect(()=>{
      if(localStorage.getItem('chat-app-user')){
        navigate('/');
      }
    },[]) 
    
      const handleValidation=()=>{
        const {password, confirmPassword, username, email} = values;
        if(password !==confirmPassword){
          toast.error("password and confirm password should be the same", toastOptions)
          return false;
        }
        else if(username.length<3){
          toast.error(
            "Username should be greater than 3 characters",
            toastOptions
          )
          return false;
        } else if(password.length<8){
          toast.error("Password should be equal or greater than 8 characters", toastOptions)
          return false;
        }
        else if(email===""){
          toast.error("email is required", toastOptions)
          return false;
        }
        else {
          return true;
        }
        
      }
    

    const handleChange = (e)=>{
      setValues({...values,[e.target.name]:e.target.value})
    }
  return (
    <>
    <FormContainer>
      <form onSubmit ={(event)=>handleSubmit(event)}>
        <div className="brand">
            <img src={logo} alt="Logo" />
            <h1>umbchat</h1>
        </div>
        <input type="text" placeholder="Username" name = "username" onChange={(e)=>handleChange(e)}/>
        <input type="text" placeholder="Email" name = "email" onChange={(e)=>handleChange(e)}/>
        <input type="text" placeholder="Password" name = "password" onChange={(e)=>handleChange(e)}/>
        <input type="text" placeholder="Confirm Password" name = "confirmPassword" onChange={(e)=>handleChange(e)}/>
        <button type="submit">Create User</button>
        <span>Already have an account ?<Link className="login" to="/login">Login</Link></span>

      </form>
    </FormContainer>
    <ToastContainer/>
    </>
  )
}


const FormContainer = styled.div`
  
    height: 100vh;
    width:100vw;
    background-color:black;
    display:flex;
    flex-direction:column;
    justify-content:center;
    gap:1rem;
    align-items:center;
    background-color:#181324;
    h1{
      font-size:100%;
      font-weight:800;
    }
    .brand{
        display:flex;
        align-items:center;
        justify-content:center;
        height:100px;
        width:300px;
        color:white;
        
    }
    .brand img{
      
      height:100%;
    }
    form{

      border:solid #503888;
      border-radius:5px;
      height:400px;
      width:30%;
      display:flex;
      flex-direction:column;
      justify-content:center;
      align-items:center;
      @media screen and (min-width:720px) and (max-width:1080px){
        width:50%;
        height:500px;
      }
      @media screen and (max-width:720px){
        width:80%;
      }

    }
    input{
      width:90%;
      height:30px;
      padding:1rem 2rem;
      border-radius:5px;
      margin: 0.5rem 1rem;
      border:none;
    }
    input :focus{
      outline:none;
    }

    button{
      background-color: #503888;
      width:50%;
      height:8%;
      border:none;
      border-radius:5px;
      transition:0.3s;
      color:white;
    }
    button:hover{
      background-color:#6a48bb;
      cursor:pointer;
    }
    span{
      color:#ccb7ff;
      font-size:0.8rem;
      margin-top:0.65rem;
    }
    .login{
      color:white;
      margin-left:4px;
      text-decoration:none;
    }


`;