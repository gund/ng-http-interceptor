var path = require('path');
var express = require('express');

var app = express();

app.use('/dist', express.static(path.join(__dirname, '..' , '..', 'dist')));
app.use('/', express.static(__dirname));

app.listen(8080, () => console.log('Running on 8080'));
