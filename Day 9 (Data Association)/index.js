const express = require('express')
const app = express();
const port = 3000;
const userModel = require("./models/user");
const postModel = require("./models/posts")




app.get('/' , (req , res) =>{
    res.send("Hello");
})
app.get('/create' , async (req , res) =>{
    let user = await userModel.create({
        username: "Prathum",
        email: "prathum@gmail.com",
        age: 21
    })

    res.send(user);
})

app.listen(port , (req ,res) =>{
    console.log("Server is listining on" , port);
})