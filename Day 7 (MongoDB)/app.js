const express = require('express')
const app = express();
const port = 3000;
const path = require('path')
const userModel = require("./models/user")

//parser
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.set('view engine' , 'ejs')
app.use(express.static(path.join(__dirname , 'public')))

app.get('/' , (req , res) =>{
    res.render("index")
})

//Read Route
app.get('/read' ,async (req ,res) =>{
    let users = await userModel.find()
    res.render("read" , {users});
})

//Create Route
app.post('/create' , async (req ,res) =>{
    let {name , email , image} = req.body;
    let createdUser = await userModel.create({
        name,
        email,
        image
    })
    console.log("User Created")
    res.redirect('/read');
})

//Delete User
app.get('/delete/:id' ,async (req ,res) => {
    let users = await userModel.findOneAndDelete({_id: req.params.id});
    res.redirect('/read')
})

//Edit User
app.get('/edit/:id' ,async (req , res) =>{
    let user = await userModel.findOne({_id: req.params.id})
    res.render("edit" , {user})
});

//Update Route
app.post('/update/:id' ,async (req , res) =>{
    let {name , email , image} = req.body;
    let user = await userModel.findOneAndUpdate({_id: req.params.id} , {image ,name , email} , {new: true})
    res.redirect("/read")
    console.log("User Updated")
});

app.listen(port , () =>{
    console.log("Server is running on: " , port)
});