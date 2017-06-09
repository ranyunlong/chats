var express = require('express');
var router = express.Router();
var Model = require('../model');


/* GET users listing. */
router.get('/', function(req, res, next) {
    res.end('users');
    // var users = new Model('users');
    // users.filed('id,userName,mobile').order('id', 'DESC').select(function(e, r, f) {
    //     res.send(r);
    // });
});

router.get('/register', function(req, res, next) {
    res.send('respond with a register');
});

module.exports = router;