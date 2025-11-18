import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Navbar } from './Navbar';
import "./css/profile.css";
import { useEffect } from "react";


export function ProfilePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    country: "",
    language: "English",
    about: "",
    password: "",
    confirmPassword: "",
  });

  async function handleSave(){
    try {
      const postData =  await axios.post("http://localhost:5000/profileData" , form , {withCredentials : true});
      console.log(postData.data); 

    } catch (error) {
      console.log(error);
      
    }
   
  }

 
useEffect(()=>{
  console.log("h")
const getData = async()=>{
  let formdata = await axios.get("http://localhost:5000/profileData" , {withCredentials : true})
  console.log(formdata.data.user);
  setForm(formdata.data.user);
 }
  getData();

  const getcookie = async()=>{
    let cdata = await axios.get("http://localhost:5000/cookie" ,  {withCredentials : true})
      console.log(cdata.data.email.email);
      setForm({...form , email: cdata.data.email.email })
      
  }
getcookie();

},[])




  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(form);
    alert("Profile Saved (Demo)");
  }

  async function handleLogOut() {
    console.log('h');
    
    let req = await axios.get("http://localhost:5000/logout" , {withCredentials : true});
    console.log(req.data);

    if (req.data === "success") {
      alert("Logged Out");
      navigate("/login");
    }
  }

  return (
    <div className="body">
      <Navbar />

      <section className="small-hero">
        <h1>Your Profile</h1>
        <p>Update your personal information used by Zero-Code Automator.</p>
      </section>

      <main className="container">
        <section className="profile-card">
          <div className="left">
            <div className="avatar">
              <img
                src="https://via.placeholder.com/400x400.png?text=Profile"
                alt="Profile"
              />
            </div>

            <div className="photo-actions">
              <label className="btn ghost" htmlFor="photoInput">
                Upload Photo
              </label>
              <input id="photoInput" type="file" accept="image/*" hidden />
              <button className="btn ghost">Remove</button>
            </div>

            <div className="user-meta">
              <strong>Your Name</strong>
              <div className="note">Member since 2025</div>
            </div>

            {/* 🔥 Logout Button Added Here */}
            <button className="btn danger" onClick={handleLogOut} style={{ marginTop: "20px" }}>
              Logout
            </button>
          </div>

          <div className="right">
            <h2>Account Information</h2>

            <form onSubmit={handleSubmit}>
              <div className="row spaced">
                <div className="col">
                  <label>Full Name *</label>
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col">
                  <label>Username</label>
                  <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row spaced">
                <div className="col">
                  <label>Email *</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    
                    required
                  />
                </div>

                <div className="col">
                  <label>Phone</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row spaced">
                <div className="col">
                  <label>Gender</label>
                  <select name="gender" value={form.gender} onChange={handleChange}>
                    <option value="">Prefer not to say</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="col">
                  <label>Date of Birth</label>
                  <input
                    name="dob"
                    type="date"
                    value={form.dob}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row spaced">
                <div className="col">
                  <label>Country</label>
                  <input
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                  />
                </div>

                <div className="col">
                  <label>Preferred Language</label>
                  <select
                    name="language"
                    value={form.language}
                    onChange={handleChange}
                  >
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
              </div>

              <div className="spaced">
                <label>About Me</label>
                <textarea
                  name="about"
                  placeholder="Write something..."
                  value={form.about}
                  onChange={handleChange}
                />
              </div>

              <div className="row spaced">
                <div className="col">
                  <label>New Password</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                  />
                </div>

                <div className="col">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="actions">
                <button onClick={handleSave} className="btn primary">Save Profile</button>
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() =>
                    setForm({
                      fullName: "",
                      username: "",
                      email: "",
                      phone: "",
                      gender: "",
                      dob: "",
                      country: "",
                      language: "English",
                      about: "",
                      password: "",
                      confirmPassword: "",
                    })
                  }
                >
                  Reset
                </button>
              </div>

            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
