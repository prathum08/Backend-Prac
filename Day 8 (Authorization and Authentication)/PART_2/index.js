const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const cookieParser = require("cookie-parser");
const userModel = require("./models/user");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.get("/", (req, res) => {
  // res.send("Hello");
  res.render("index");
});

app.post("/create", async (req, res) => {
  let { username, email, password, age } = req.body;

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      let createdUser = await userModel.create({
        username,
        email,
        age,
        password: hash,
      });
      let token = jwt.sign({email} , "shhhhh");
      res.cookie("token" , token);
      res.redirect('/');
    });
  });

  
});

//login route
app.get('/login' , (req , res) =>{
    res.render('login');
})

app.post('/login' , async (req , res) =>{
    let user = await userModel.findOne({email: req.body.email})
    if(!user){
        return res.send("something went wrong");
    }

    bcrypt.compare(req.body.password , user.password , (err , result) =>{
        console.log(result);
    })
})
//logout route
app.get('/logout' , (req , res) =>{
    res.cookie("token" , "");
    res.redirect('/');
})

app.listen(port, (req, res) => {
  console.log("Server is listing on ", port);
});
