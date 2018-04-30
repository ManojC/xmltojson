let express = require("express");
let fs = require('fs');
var convert = require('xml-js');
let path = require('path');

let app = express();

// app.use(express.static(path.join(__dirname, './public/')));

app.use('/', (req, res, next) => {

    var xml = fs.readFileSync(path.join(__dirname, './data.xml'), 'utf8');

    var options = { 
        ignoreComment: true, 
        alwaysChildren: true,
        compact: true,
        nativeType: true
    };

    var result = convert.xml2js(xml, options); // or convert.xml2json(xml, options)
    
    res.json(result);

    // res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(3000, () => {
    console.log("listening to port 3000");
});