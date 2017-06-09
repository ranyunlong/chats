var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var path = require('path');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../templates') + '/index.html');
});
module.exports = router;