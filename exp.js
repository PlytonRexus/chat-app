const express = require ('express');
const http = require ('http');
const path = require ('path');
const morgan = require ('morgan');
const cors = require ('cors');

require('./db/mongoose');

const exp = express();
const server = http.createServer(exp);
module.exports = {server};

const sockets = require ('./controllers/sockets');
const join = require ('./routes/join');
const users = require ('./routes/users');
const chat = require ('./routes/chat');
const rooms = require ('./routes/rooms');

const port = process.env.PORT || 3000;
const newHTML = path.join(__dirname, 'public', 'index.html');
const allowedOrigins = ['http://localhost:3000', 'https://calm-everglades-51344.herokuapp.com'];

exp.use(morgan('dev'));
exp.use(cors());

// {
// 	origin: function(origin, callback){    
// 		// allow requests with no origin 
// 		// (like mobile apps or curl requests)
// 		if(!origin) return callback(null, true);
// 		if(allowedOrigins.indexOf(origin) === -1){
// 			var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
// 			return callback(new Error(msg), false);
// 		}
// 		return callback(null, true);
// 	}
// }

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
exp.use('/rooms', rooms);

exp.get('/new', (req, res) => {
    res.sendFile(newHTML);
});

sockets.ioConnection;

server.listen(port, () => {
    console.log('HTTP server in Express is active on port ' + port + '.');
});
