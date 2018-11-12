var mongoose = require('mongoose');


var News = mongoose.model('News',{
    text:{
        type: String,
        trim: true,
        minLength: 2
    },
    title:{
        type: String,
        trim: true,
        minlength: 2
    },
    description:{
        type: String,
        trim: true,
        minlength: 2
    },
    date:{
        type: Date,
        default: Date.now()
    }
});

module.exports = {News};