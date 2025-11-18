import { useState } from 'react';
import './css/register.css'
import axios from 'axios'
import { Navbar } from './Navbar';
export function Register() {
    const [password ,  setPassword] = useState("");
    const [email , setemail] = useState("");
    const [username , setusername] = useState("");

   async function handleClick(){
        let userData = {
            email , password  , username
        }

        const req = await axios.post("http://localhost:5000/register" , userData)

        console.log(req);
        
    }
  return (
    <>
      <Navbar />

    <div class="form-container">
        <h2>Create Account</h2>

        <form>
            <input type="text" onChange={(e)=>{
                setusername(e.target.value);
            }} placeholder="Full Name" required />
            <input type="email"  onChange={(e)=>{
                setemail(e.target.value);
            }}placeholder="Enter Email" required />
            <input type="password" onChange={(e)=>{
                setPassword(e.target.value);
            }} placeholder="Create Password" required />

            <button onClick={handleClick} type="submit">Register</button>
        </form>

        <p>Already have an account? <a href="/login">Login</a></p>
    </div>
      
    </>
  );
}
