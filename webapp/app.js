const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

var logger = function(req,res,next){

    console.log("Request was made");
    next();
};

app.use(logger);
app.use(express.static('public'));
app.get('/',function(req,res){

    //res.sendFile(path.join(__dirname,'/views/app.html'));
    res.sendFile(path.join(__dirname,'/public/views/app.html'));
});
app.get('/statistics',function(req,res){

    //res.sendFile(path.join(__dirname,'/views/app.html'));
    res.sendFile(path.join(__dirname,'/public/views/app.html'));
});
app.get('/landing',function(req,res){

    //res.sendFile(path.join(__dirname,'/views/app.html'));
    res.sendFile(path.join(__dirname,'/public/views/app.html'));
});
app.get('/registerform',function(req,res){

    //res.sendFile(path.join(__dirname,'/views/app.html'));
    res.sendFile(path.join(__dirname,'/public/views/app.html'));
});
app.get('/formdisplay',function(req,res){

    //res.sendFile(path.join(__dirname,'/views/app.html'));
    res.sendFile(path.join(__dirname,'/public/views/app.html'));
});
app.get('/login',function(req,res){

    //res.sendFile(path.join(__dirname,'/views/app.html'));
    res.sendFile(path.join(__dirname,'/public/views/app.html'));
});

app.post('/dataTransfer',function(req,res){

    //console.log(req);
    res.send("Result okay");
    
});
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});