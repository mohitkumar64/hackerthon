const express =  require('express')
const cors = require('cors')
const connectDB = require('./Db/connectDB')
const app = express();
const PORT = 5000;
const userModel = require('./models/user')
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config()

app.use(
  cors({
    origin: "http://localhost:5174",
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

app.get("/profile", authMiddleware, (req, res) => {
    res.json({ message: "ok", user: req.user });
});



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
  console.log(user);
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
