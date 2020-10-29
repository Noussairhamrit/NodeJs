const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = ['http://localhost:3000', 'https://localhost:3443', 'http://localhost:4200'];///all the originsthat this server is willing to accept. 
var corsOptionsDelegate = (req, callback) => {
    var corsOptions;
    console.log(req.header('Origin'));
    if(whitelist.indexOf(req.header('Origin')) !== -1) {///pour verfier s'il est origin ou nn
        corsOptions = { origin: true };
    }
    else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};
///we'll simply use the standard cors. (get mithel)
exports.cors = cors();
///So that way, if you need to apply A cors with specific options to a particular route
exports.corsWithOptions = cors(corsOptionsDelegate);