const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const _ = require('lodash');
const cors = require('cors');
const { ObjectID } = require('mongodb');
require('./db/mongoose');

var {News} = require('./models/news');

const port = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(morgan('dev'));

app.get('/', (req, res,next) => {
    News.find({}).then((result) =>{
        console.log(result);
        let sortedNews = result.sort(custom_sort_ascending);
        res.status(200).send(sortedNews);
    }).catch((err)=> {
        console.log(err);
        res.status(400).send(err);
    })
});

app.post('/news-by-text', (req, res, next)=> {
    //this search query to filter the news by title or text (it returns the news that contains the search query in text or title)
    if(req.body.query){
        let query = {
            "$or": [{ "title": { "$regex": req.body.query, "$options": "i" } }, { "text": { "$regex": req.body.query, "$options": "i" } }]
        };

        News.find(query).then((result) => {
            console.log(result);
            let sortedNews = result.sort(custom_sort_ascending);
            res.status(200).send(sortedNews);
        }).catch((err) => {
            console.log(err);
            res.status(400).send(err);
        })
    }
    else{
        res.status(404).send({"Error":"Please Enter Search Query"})
    }
    
});


app.post('/news/add', (req, res, next)=> {
    var news = new News({
        text: req.body.text,
        title: req.body.title,
        description: req.body.description,
        date: req.body.date
    });
    

    news.save().then((result)=> {
        
        res.status(200).send(result);
    }, (err)=> {
        console.log(err);
        res.status(400).send(err);
    });
});

app.get('/news/:id', (req, res, next)=> {
    var id = req.params.id;
    if(ObjectID.isValid(id)){
        News.find({
            _id: id
        }).then((result) => {
            if(!result){
                return res.status(404).send();
            }
            res.status(200).send(result);
        }).catch((err)=> {
            res.status(400).send(err)
        })
    }else{
        res.status(404).send("empty body");
    }
});

app.delete('/news/:id',  (req, res, next) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        res.status(404).send();
    }
    News.findOneAndRemove({
        _id: id
    }).then(result => {
        if (!result) {
            return res.status(404).send({"Error": "Not Found"});
        }
        res.status(200).send(result)
    }, (e) => {
        res.status(400).send();
    })
});

//UPDATING NEWS BY ID
app.patch('/news/:id', (req, res, next)=> {
    var id = req.params.id;
    var body = _.pick(req.body,[ 'title', 'text', 'description']);
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    News.findByIdAndUpdate(id,{$set: body}, {new: true}).then(result =>{
        if(!result){
            res.status(404).send();
        }
        res.send({result});
    }).catch(e =>{
        res.status(400).send(e)
    })
})


// SORTING NEWS BY ITS DATE (descending order)
function custom_sort_descending(a, b) {
    console.log(a.date.getTime(), b.date.getTime())
    return ((-1*(a.date).getTime()) + (b.date).getTime());
}

//SORTING NEWS BY ITS DATE (ascending)
function custom_sort_ascending(a, b) {
    console.log(a.date.getTime(), b.date.getTime())
    return (a.date).getTime() - (b.date).getTime();
}






app.listen(port, ()=>{
    console.log(`Server is running on ${port}`);
});