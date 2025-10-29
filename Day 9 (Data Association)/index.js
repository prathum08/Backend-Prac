const express = require('express')
const app = express();
const port = 3000;
const userModel = require("./models/user");
const postModel = require("./models/posts");


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

app.get('/post/create' ,async (req ,res) =>{
    let post = await postModel.create({
        postdata : "Hello Bachoo",
        user : "690224c45d141204dab82d77"
    })
    let user = await userModel.findOne({_id: "690224c45d141204dab82d77"})
    user.posts.push(post._id);
    // if we are ot save automatically we have to use .save() and this is await call
    await user.save();
    res.send({post , user});
})

app.listen(port , (req ,res) =>{
    console.log("Server is listining on" , port);
})

// This is the lecture for data associaation between different models
