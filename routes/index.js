var express = require('express');
var router = express.Router();

var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
	let filepath = path.resolve(__dirname, "../html", "index.html")
	res.sendFile(filepath);
	// res.redirect("/code");
	// res.send("Hello express!");
});

module.exports = router;
