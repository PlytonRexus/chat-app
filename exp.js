const express = require ('express');
const socketio = require ('socket.io');
const http = require ('http');
const path = require ('path');

const exp = express();
const server = http.createServer(exp);
const io = socketio(server);

const port = process.env.PORT || 3000;
const indexHTML = path.join(__dirname, "public", "index.html");

exp.use('/public/js', express.static('public/js'));
exp.use('/public/css', express.static('public/css'));

exp.get("/", (req, res) => {
    res.sendFile(indexHTML);
});

var count = 0;

io.on('connection', (socket) => {
    console.log('New webSocket connection established.');

    socket.emit('new connection', 'Welcome to the chat page!');

    socket.emit('count updated', count);

    socket.on('send message', (msg) => {
        io.emit('receive message', msg);
    });

    socket.on('increment',() => {
        console.log('Incremented.');
        count += 1;
        console.log(count);
        io.emit('count updated', count);
    });
    socket.on('disconnect', () => {
        console.log('Connection terminated.');
    });
});

server.listen(port, () => {
    console.log("HTTP server in Express is active on port " + port + ".");
});