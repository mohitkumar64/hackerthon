
const express = require('express');
const cors = require('cors');
const connectDB = require('./Db/connectDB');
const app = express();
const PORT = 5000;
let data;
const axios = require("axios")
const userModel = require('./models/user');
const UserSubmissions = require('./models/formsModel');
const profileModel = require("./models/profileModel");

const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// ====================================================
//  MIDDLEWARES
// ====================================================
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
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "authenticated" });

  try {
    const decoded = jwt.verify(token, "shhhh");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}




app.get('/cookie', (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(200).json("no token");

  const decoded = jwt.verify(token, "shhhh");
  res.status(200).json({ email: decoded.email });
});

app.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: "ok", user: req.user });
});

app.post("/save-form", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token)
      return res.status(401).json({ success: false, message: "Not logged in" });

    const decoded = jwt.verify(token, "shhhh");
    const email = decoded.email;

    const formData = req.body.data;
    if (!formData)
      return res.status(400).json({ success: false, message: "No form data" });

    let user = await UserSubmissions.findOne({ email });

    if (!user) {
      user = await UserSubmissions.create({
        email,
        submissions: [{ data: formData }],
      });
    } else {
      user.submissions.push({ data: formData });
      await user.save();
    }

    res.json({ success: true, message: "Form saved", user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/profileData", async (req, res) => {
  const token = req.cookies.token;
  let email;

  if (token) {
    const decoded = jwt.verify(token, "shhhh");
    email = decoded.email;
  }

  let user = await profileModel.findOne({ email });
  if (!user) return res.status(404).json("error");

  res.status(200).json({ user });
});

app.post("/profileData", async (req, res) => {
  try {
    const token = req.cookies.token;
    let email;

    if (token) {
      const decoded = jwt.verify(token, "shhhh");
      email = decoded.email;
    }

    const form = req.body;

    let user = await profileModel.findOne({ email });
    if (!user) return res.status(404).json("error");

    Object.assign(user, form);
    await user.save();

    res.status(200).json("success");
  } catch (error) {
    console.log(error);
  }
});

app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

app.get("/logout", (req, res) => {
  const token = req.cookies.token;

  if (!token) return res.status(200).json("no-token");

  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });

  return res.status(200).json("success");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  let user = await userModel.findOne({ email });
  if (!user) return res.status(404).json("wrong credentials");

  const token = jwt.sign({ email }, "shhhh");

  if (user.password === password) {
    res.cookie("token", token);
    res.status(200).json("success");
  } else {
    res.status(404).json("wrong credentials");
  }
});

app.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    await userModel.create({ email, password, username });
    await profileModel.create({ email });

    res.status(200).json("added");
  } catch (error) {
    console.log(error);
  }
});


// ====================================================
//  ZAPIER + GEMINI MODULE (NEW PART)
// ====================================================
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

let posts = []; // in-memory (for demo)

app.post("/post",(req,res)=>{
  
  data = req.body;
  console.log(data);
  
  res.status(200).json({status : "good"})
  
})

app.get("/trigger", async (req, res) => {
  console.log('hit');
  
  try {
    await axios.post("https://mohitkumar232.app.n8n.cloud/webhook/run-from-backend ", {
      triggeredBy: "frontend"
    });

    res.json({ success: true, message: "Workflow triggered" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to trigger workflow" });
  }
});

app.get('/getauto' , (req,res)=>{
  console.log('ht');
  
    res.status(200).json({data});
})

async function generateSocialContent(post) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
Create social media posts from this blog:

Title: ${post.title}
Content: ${post.content}

Return ONLY valid JSON:
{
 "instagram": "",
 "linkedin": "",
 "tweet": "",
 "summary": ""
}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    post.result = JSON.parse(text);
    post.status = "done";
  } catch (err) {
    post.status = "error";
    post.result = { error: err.message };
  }
}

// Frontend polling route
app.get("/posts", (req, res) => {
  res.json(posts);
});


// ====================================================
//  START SERVER
// ====================================================
const start = async () => {
  await connectDB(process.env.Mongoose_Url);
  console.log("DB connected!");

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

start();
