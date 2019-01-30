const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());
var logger = function (req, res, next) {

    console.log("Request was made");
    next();
};
var config = {
    apiKey: "AIzaSyApyPVMUxBRyZPWwgOmxxBLy8wh8cLcrfA",
    authDomain: "dave-28da5.firebaseapp.com",
    databaseURL: "https://dave-28da5.firebaseio.com",
    projectId: "dave-28da5",
    storageBucket: "dave-28da5.appspot.com",
    messagingSenderId: "655534704604"
};
var firebase = require('firebase');
firebase.initializeApp(config);
const db = firebase.firestore();
db.settings({
    timestampsInSnapshots: true
});

app.use(logger);
app.use(express.static('public'));
app.get('/', function (req, res) {

    //res.sendFile(path.join(__dirname,'/views/app.html'));
    res.sendFile(path.join(__dirname, '/public/views/app.html'));
});
app.get('/statistics', function (req, res) {

    //res.sendFile(path.join(__dirname,'/views/app.html'));
    res.sendFile(path.join(__dirname, '/public/views/app.html'));
});
app.get('/landing', function (req, res) {

    //res.sendFile(path.join(__dirname,'/views/app.html'));
    res.sendFile(path.join(__dirname, '/public/views/app.html'));
});
app.get('/registerform', function (req, res) {

    //res.sendFile(path.join(__dirname,'/views/app.html'));
    res.sendFile(path.join(__dirname, '/public/views/app.html'));
});
app.get('/formdisplay', function (req, res) {

    //res.sendFile(path.join(__dirname,'/views/app.html'));
    res.sendFile(path.join(__dirname, '/public/views/app.html'));
});
app.get('/login', function (req, res) {

    //res.sendFile(path.join(__dirname,'/views/app.html'));
    res.sendFile(path.join(__dirname, '/public/views/app.html'));
});

app.post('/dataTransfer',async function (req, res) {

    let formData = req.body;
    let targetForm = null;
    await db.collection("users").doc(formData.uid).collection('formData').get().then((querySnapshot) => {
        
        if(querySnapshot.forEach( doc => {
            console.log(doc.data());
        }));
        else{
            console.log('There is no data');
        }
    });
    res.send("Result okay");

});
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});