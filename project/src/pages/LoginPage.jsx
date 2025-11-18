import './css/login.css'
import { useState  } from 'react';
import { useNavigate } from "react-router-dom";
import { Navbar } from './Navbar';

import axios from 'axios'
export function Login() {
    const navigate = useNavigate()
 const [password ,  setPassword] = useState("");
 const [email , setemail] = useState("");
   async function handleClick(e){
    e.preventDefault()
        console.log("true");
        const userData = {

            email , password
        }
        setPassword("")
        setemail("")
        try {

            const req = await axios.post("http://localhost:5000/login" , userData , {withCredentials : true});
            console.log(req)
            
            alert("logged success")
            navigate("/profile");

        } catch (error) {
            console.log(error);
            
        }
       
       
    }
  return (
    <>
      {/* <nav className="navbar">
        <div className="logo">ZeroCode Automator</div>
        <ul className="nav-links">
          <li><a href="index.html">HomePage</a></li>
          <li><a href="profile.html">Profile</a></li>
          <li><a href="automation.html">Automation</a></li>
          <li><a href="accessibility.html">Accessibility</a></li>
          <li>
            <a href="/login" className="active login">
              Login
            </a>
          </li>
        </ul>
      </nav> */}
      <Navbar />

      <div className="form-container">
        <h2>Login</h2>

        <form >
          <input onChange={(e)=>{
            setemail(e.target.value)
          }} type="email" value={email} placeholder="Enter Email" required />
          <input onChange={(e)=>{
            setPassword(e.target.value)
          }}  type="password" value={password} placeholder="Enter Password" required />
          <button onClick={handleClick} >Login</button>
        </form>

        <p>
          Don't have an account? <a href="/register">Register</a>
        </p>
      </div>
    </>
  );
}
