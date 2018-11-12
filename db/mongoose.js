var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://root:abc123@ds123532.mlab.com:23532/news-api', {useNewUrlParser: true},(err)=>{
    if(err){
        console.log('Cannot connect to Database')
    }
});

module.exports = {
    mongoose
};