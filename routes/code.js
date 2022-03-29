var express = require('express');
var router = express.Router();

var path = require('path');

/* GET code page. */
router.get('/', function(req, res, next) {
	let filepath = path.resolve(__dirname, "../html", "code.html")
  	res.sendFile(filepath);
});

module.exports = router;
