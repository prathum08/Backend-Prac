// var obj = {
//     name : "Prathum",
//     age: 21,
//     role: "Software Developer"
// }

// // to freeze the object
// Object.freeze(obj)

// async js

async function abcd(){
    var blob = await fetch(`https://randomuser.me/api/`);
    var ans = await blob.json();


    console.log(ans.results[0].dob.age);
}


abcd();