const express = require ('express');
const http = require ('http');
const path = require ('path');
const morgan = require ('morgan');

require('./db/mongoose');

const exp = express();
const server = http.createServer(exp);
module.exports = {server};

const sockets = require ('./controllers/sockets');
const join = require ('./routes/join');
const users = require ('./routes/users');
const chat = require ('./routes/chat');

const port = process.env.PORT || 3000;
const newHTML = path.join(__dirname, 'public', 'index.html');

exp.use(morgan('dev'));

exp.use(express.json());
exp.use(express.urlencoded({ extended: true }));

exp.use('/public', express.static('public'));
exp.use('/public/js', express.static('public/js'));
exp.use('/public/css', express.static('public/css'));
exp.use('/public/original', express.static('public/original'));
exp.use('/public/original/css', express.static('public/original/css'));
exp.use('/public/original/js', express.static('public/original/js'));
exp.use('/public/assets/img', express.static('public/assets/img'));

exp.use('/', join);
exp.use('/users', users);
exp.use('/chat', chat);

exp.get('/new', (req, res) => {
    res.sendFile(newHTML);
});

sockets.ioConnection;

server.listen(port, () => {
    console.log('HTTP server in Express is active on port ' + port + '.');
});
