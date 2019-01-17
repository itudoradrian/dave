const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

var logger = function(req,res,next){

    console.log("Request was made");
    next();
};
//app.set('view engine','ejs');
//app.set('views',path.join(__dirname,'views'));
app.use(logger);

//Set static path
//app.use(express.static('views'));
app.use(express.static('public'));
//app.use('/images',express.static('public'));
//app.use('/javascript',express.static('public'));


app.get('/',function(req,res){

    //res.sendFile(path.join(__dirname,'/views/app.html'));
    res.sendFile(path.join(__dirname,'/public/views/app.html'));
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});