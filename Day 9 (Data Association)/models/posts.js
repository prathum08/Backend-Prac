const mongoose = require('mongoose')

let postSchema = mongoose.Schema({
    postdata: String,
    user: String,
    date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("post" , postSchema);