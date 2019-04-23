// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var cors = require('cors');
const app = express();

// Get our API routes
const admin = require ('./routes/admin_controller')
const employee = require('./routes/employeRoutes')
const event = require('./routes/eventController')
const service = require('./routes/serviceController')

//autorizations header
app.use(function (req, res, next) {
    var allowedOrigins = ['http://localhost:4200' ,'http://localhost:4400',  ]
    var origin = req.headers.origin;
    if (allowedOrigins.indexOf(origin) > -1) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST,HEAD, OPTIONS,PUT, DELETE,PATCH'); //
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Accept', 'Authorization');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization,application/json");
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

//conncet to mongodb 
mongoose.Promise = global.Promise;
//connection to databse
mongoose.connect('mongodb://localhost/PFE_Project_BD_booking');
var conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'connection error:'));
conn.once('open', function () {
    console.log("connection is established");
});

app.use(cors());
// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));
//******* Set our api routes
app.use('/admin' , admin) ;
app.use('/employee' , employee) ;
app.use('/event' , event) ;
app.use('/service' , service) ;
//set port
const port = process.env.PORT || '3000';
app.set('port', port);
const server = http.createServer(app);
server.listen(port, () => console.log(`API running on localhost:${port}`));                               
