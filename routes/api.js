var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    
    User.find({}, function(err, users) {
        
        users.forEach(function(user) {
            res.send(user);
        })
    })
    
});

module.exports = router;