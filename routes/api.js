var express = require('express');
var router = express.Router();

let { exec } = require("child_process");
let fs = require('fs');
let fsExtra = require('fs-extra')
var path = require('path');
let tempPath = path.resolve(__dirname, "../temp");

fsExtra.emptyDirSync(tempPath);

const langs = {
	"python": ["py", "python {{name}}.{{ext}}"],
	"nodejs": ["js", "node {{name}}.{{ext}}"],
	"c++": ["cpp", "gcc {{name}}.{{ext}} -lstdc++ -o{{name}} && ./{{name}}"],
}

router.get('/', function (req, res, next) {
	let data = {};
	Object.keys(langs).forEach(k => data[k] = langs[k][0])
	res.json(data);
});

router.post('/', async function (req, res, next) {
	let { lang, code } = req.body;
	
	// check if code is clean && lang is in langs (TODO later)
	
	let filename = `${(code.length)}-${Date.now()}-${req.ip.replace(/\./g,"_")}`;
	let ext = langs[lang][0];
	// write code to a file in ../temp
	try {
		fs.writeFileSync(`${tempPath}/${filename}.${ext}`, code);
	} catch (e) { 
		return res.json({ output: encodeURIComponent(e), error: true });
	}

	let cmd = langs[lang][1]
		 .replace(/{{name}}/g, `temp/${filename}`)
		 .replace(/{{ext}}/g, langs[lang][0]);
	
	// execute the code in ../temp
	exec(cmd, (error, stdout, stderr) => {
	    if (stderr) 
			res.json({ output: encodeURIComponent(stderr), error: true });
	    else if (error) 
			res.json({ output: encodeURIComponent(error), error: true });
		else 
			res.json({ output: encodeURIComponent(stdout), error: false });

		try {
			// delete file in ../temp
			fs.unlinkSync(`${tempPath}/${filename}.${ext}`);

			// remove executable file too
			let countName = (langs[lang][1].match(/{{name}}/g) || []).length;
			if (countName > 1) 
				fs.unlinkSync(`${tempPath}/${filename}`);
				
		} catch (e) { console.error(e); }
	});

	console.log(`From IP: ${req.ip}, executed:\n${code}`);
});

module.exports = router;
