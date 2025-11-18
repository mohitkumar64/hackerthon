const express =  require('express')
const cors = require('cors')
const connectDB = require('./Db/connectDB')
const app = express();
const PORT = 5000;
const userModel = require('./models/user')
const UserSubmissions = require('./models/formsModel')

const profileModel = require("./models/profileModel")
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config()

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true,

  })
);
app.use(express.json()); 
app.use(cookieParser());



function authMiddleware(req, res, next) {
    console.log(req.cookies)
    const token = req.cookies.token;
    console.log(token); 
    
    if (!token) return res.status(401).json({ message: "authenticated" });

    try {
        const decoded = jwt.verify(token, "shhhh");
        req.user = decoded;
        console.log(req.user);
        
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}
app.get('/cookie' , (req, res)=>{
   console.log(req.cookies)
    const token = req.cookies.token;
    console.log(token); 
    
        const decoded = jwt.verify(token, "shhhh");
       const email = decoded;
        res.status(200).json({email})
})
app.get("/profile", authMiddleware, (req, res) => {
    res.json({ message: "ok", user: req.user });
});

app.post("/save-form", async (req, res) => {
  try {
     
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not logged in" });
    }

    // 2️⃣ Decode JWT to get email
    const decoded = jwt.verify(token, "shhhh");

    // Your token should contain { email: "x@gmail.com" }
    const email = decoded.email;
    if (!email) {
      return res.status(400).json({ success: false, message: "Invalid token (no email)" });
    }

    // 3️⃣ Extract form data sent from frontend
    const formData = req.body.data;   // ⬅ FIXED (your code sends it inside "data")
    if (!formData) {
      return res.status(400).json({ success: false, message: "No form data received" });
    }

    // 4️⃣ Find user or create new one
    let user = await UserSubmissions.findOne({ email });

    if (!user) {
      // New user entry
      user = await UserSubmissions.create({
        email,
        submissions: [{ data: formData }]
      });
    } else {
      // Existing user → push submission
      user.submissions.push({ data: formData });
      await user.save();
    }

    // 5️⃣ Response
    res.json({ success: true, message: "Form saved", user });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/profileData" , async (req,res)=>{
  console.log('hit profile');
  
  const token = req.cookies.token;
  let email;
  if(token){
  const decoded = jwt.verify(token, "shhhh");
  email = decoded.email;
  console.log(email);
  

}
 let user = await profileModel.findOne({email});
 console.log(user )
  if(!user) return res.status(404).json("error");
  console.log("sucess sending data ")
  res.status(200).json({user});

})


app.post("/profileData" , async (req,res)=>{
  try {
    console.log("data hit ");
  const token = req.cookies.token;
  let email;
  if(token){
  const decoded = jwt.verify(token, "shhhh");
  email = decoded.email ;
  console.log(`eamil ${email}`);

  
}
  
  const form = req.body;
  console.log(form);
  
  let user = await profileModel.findOne({email});
  if(!user) return res.status(404).json("error");

  Object.assign(user , form)
 await user.save(); 
  console.log(user);
  res.status(200).json("sucess");
  } catch (error) {
    console.log(error);
    
  }
  
} )



app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

app.get("/logout", (req, res) => {
  const token = req.cookies.token;
  

  if (!token) {
    return res.status(200).json("no-token");
  }

  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false // change to true in production
  });

  return res.status(200).json("success");
});


app.post("/login", async(req, res) => {
  const { email, password } = req.body;
  console.log('login route hit');
  
  let user = await userModel.findOne({email});
  if(!user) return res.status(404).json("email or password is wrong");
  console.log(user)
  const token =  jwt.sign({email} , "shhhh");

  if(user.password === password){
    console.log("correct")
    res.cookie("token" ,token);
    res.status(200).json("success")
  }else{
    res.status(404).json("email or password is wrong");
  }
  



});
app.post("/register", async (req, res) => {
  
  try {
    
    const { email,username ,  password } = req.body;
  const user = await userModel.create({
    email , password , username
  })  
  const profiledata = await profileModel.create({email});
  console.log(profiledata);
  
  
  res.status(200).json("added");
  } catch (error) {
    console.log(error);
    
  }
  
  
});


const start = async()=>{
  await connectDB(process.env.Mongoose_Url);
  console.log("db is running at");

  app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
  
}

start();
