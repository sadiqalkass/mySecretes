require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose')
const encrypt = require("mongoose-encryption")

const app = express();

app.set('view engine', 'ejs');
mongoose.connect("mongodb://127.0.0.1:27017/userDB")

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const userSchema = new mongoose.Schema({
  email: String,
  password: String 
})

userSchema.plugin(encrypt, {secret: process.env.SECRETS, encryptedFields: ["password"]} )

const User = new mongoose.model('user', userSchema)

app.get('/', (req,res)=>{
  res.render("home")
})
app.get('/login', (req,res)=>{
  res.render("login")
})
app.get('/register', (req,res)=>{
  res.render("register")
})
app.get('/submit', (req,res)=>{
  res.render("submit")
})

app.post('/register', (req,res)=>{
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  })
  newUser.save().then(()=> res.render('secrets'))
})

app.post('/login', (req,res)=>{
  const username = req.body.username
  const password = req.body.password
  async function authUser() {
    const user = await User.findOne({email: username})
    if (user) {
      if (user.password === password) {
        res.render('secrets')
      }else{
        res.send('Wrong password')
      }
    } else {
      res.send("User not Found")
    }
  }
  authUser()
})

app.listen(3000, function() {
    console.log("Server started on port 3000");
  });