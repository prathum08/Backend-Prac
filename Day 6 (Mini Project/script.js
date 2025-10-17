const express = require('express')
const path = require("path")
const app = express();
const fs = require('fs');
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname , "public")))

app.set("view engine" , "ejs")

app.get("/" , (req ,res) =>{
    fs.readdir(`./files` , function(err ,files){
        // console.log(files);
        res.render("index" , {files: files})
    })
})

app.get('/files/:filename' , (req ,res) =>{
    const filename = req.params.filename.trim(); // Remove leading/trailing whitespace
    fs.readFile(`./files/${filename}`, 'utf-8', function(err, data){
        if(err){
            console.error(err);
            return res.status(404).send("File not found");
        }
        // console.log(data)
        res.render('show' , {filename: filename , filedata: data});
    });
});

app.get('/edit/:filename' , (req ,res) =>{
    const filename = req.params.filename.trim(); // Remove leading/trailing whitespace
    // console.log(filename);
    res.render('edit' , {filename: filename})
});

app.post('/edit' , (req ,res)=>{
    // console.log(req.body.newname);
    fs.rename(`./files/${req.body.previous}` , `./files/${req.body.newname}` , function (err){
        res.redirect('/')
    })    
})


app.post('/create' , (req ,res) =>{
    // console.log(req.body)
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt` , req.body.details , function(err){
        res.redirect("/")

    })
})



app.listen(3000 , () =>{
    console.log("Server is Running on" , 3000);
})