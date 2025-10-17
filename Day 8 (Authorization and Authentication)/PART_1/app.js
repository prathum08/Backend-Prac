const express = require("express");
const app = express();
const port = 3000;
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

app.use(cookieParser());

app.get("/", (req, res) => {
  //this method is done to convert the data to jwt
  let token = jwt.sign({email : "prathum@gmail.com"} , "secret");
  res.cookie("token" , token);
  res.send("done");
});

app.get('/read' , (req , res) =>{
  // this method is used to verify or to extract the data
  let data = jwt.verify(req.cookies.token , "secret");
  console.log(data);
})

app.listen(port, () => {
  console.log("Server is Listening..", port);
});
