const express = require("express");
const userModel = require("./models/user");
const postModal = require("./models/post")
const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

//Profile
app.get('/profile' , isLoggedIn ,async (req ,res) => {
  let user = await userModel.findOne({email : req.user.email}).populate("posts")
  // console.log(user);
  res.render("profile" , {user});
})

//Register
app.post("/register", async (req, res) => {
  let { email, password, age, username, name } = req.body;

  let user = await userModel.findOne({ email });
  if (user) {
    return res.status(300).send("User Already Registered");
  }

  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, async (err, hash) => {
      let user = userModel.create({
        email,
        username,
        age,
        name,
        password: hash,
      });

      let token = jwt.sign({ email: email, userid: user._id }, "shhhh");
      res.cookie("token", token);
      res.send("User Registered");
    });
  });
});

//Login
app.post("/login", async (req, res) => {
  let { email, password } = req.body;

  let user = await userModel.findOne({ email });
  if (!user) {
    return res.status(500).send("Something Went Wrong");
  }

  bcrypt.compare(password, user.password, function (err, result) {
    if (result) {
        let token = jwt.sign({ email: email, userid: user._id }, "shhhh");
        res.cookie("token", token);
        res.status(200).redirect("/profile");
    } else {
      res.redirect("/login");
    }
  });
});

//Logout
app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("login");
});



// Middleware for protected Routes
function isLoggedIn(req , res , next){
    if(req.cookies.token === ""){
        res.redirect("/login");
    }
    else{
        let data = jwt.verify(req.cookies.token , "shhhh");
        req.user = data;
        next();
    }
    
}
//posts route
app.post('/post' , isLoggedIn ,async (req ,res) => {
  let user = await userModel.findOne({email : req.user.email})
  let {content} = req.body
  let post = await postModal.create({
    user: user._id,
    content
  })

  user.posts.push(post._id)
  await user.save();
  res.redirect("/profile")
})

//Like Feature
app.get('/like/:id' , isLoggedIn ,async (req ,res) => {
  let post = await postModal.findOne({_id: req.params.id}).populate("user")

  if(post.likes.indexOf(req.user.userid) === -1){
    post.likes.push(req.user.userid)
  }
  else{
    post.likes.splice(post.likes.indexOf(req.user.userid) , 1)
  }
  await post.save()
  res.redirect("/profile");
})

app.get("/edit/:id" , async (req , res) =>{
  let post = await postModal.findOne({_id: req.params.id}).populate("user")

  res.render("edit" , {post})
})

//update post
app.post("/update/:id" , async (req , res) =>{
  let post = await postModal.findOneAndUpdate({_id: req.params.id} , {content: req.body.content})

  res.redirect("/profile")
})


app.listen(port, (req, res) => {
  console.log("Server running on:- ", port);
});
