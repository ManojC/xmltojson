let express = require("express"),
    fs = require('fs'),
    path = require('path'),
    convert = require('xml-js'),
    flow = require('xml-flow');

let app = express();

//poc route
app.use('/poc', (req, res, next) => {
    // synchronous(req, res, next);
    // defaultStream(req, res, next);
    xmlFlowStream(req, res, next);
});

function synchronous(req, res, next) {
    var xml = fs.readFileSync(path.join(__dirname, './data.xml'), 'utf8');
    var options = {
        ignoreComment: true,
        alwaysChildren: true,
        compact: true,
        nativeType: true
    };
    var result = convert.xml2js(xml, options); // or convert.xml2json(xml, options)
    res.json(result);
}

function defaultStream(req, res, next) {
    let count = 0;
    let stream = fs.createReadStream(path.join(__dirname, './data.xml'));
    stream.on('data', (data) => {
        res.write(data);
        ++count;
        console.log(++count);
    });
    stream.on('end', () => {
        res.end();
        count = 0;
        console.log("finished!");
    });
    stream.on('error', () => {
        res.json("error occurred!!!");
        count = 0;
        console.log("error occured!");
    });
}

function xmlFlowStream(req, res, next) {
    let count = 0;
    let xmlStream = flow(fs.createReadStream(path.join(__dirname, './data.xml')));
    xmlStream.on('text', function (item) {
        if (count === 0) {
            res.write(JSON.stringify(item));            
        }
        ++count;
    });
    xmlStream.on('end', function () {
        console.log(`xml flow finished after reading ${count} rows!!!`);
        res.end();
    });
    xmlStream.on('error', function (error) {
        console.log(error);
        res.end();
    });
}

app.listen(3000, () => {
    console.log("listening to port 3000");
});