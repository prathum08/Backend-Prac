// const fs = require('fs');


// fs.readFile('hello.txt' ,'utf8', function(err ,data){
//     if(err){
//         console.error(err)
//     } 
//     else{
//         console.log(data)
//     }
// })

//HTTP Module


const http = require('http');

const server = http.createServer(function(req , res){
    res.end("Hello Evryone Server is Running")
})

server.listen(3000);