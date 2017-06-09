var express = require('express');
var router = express.Router();
var path = require('path');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.end('访问根目录');
});

module.exports = router;