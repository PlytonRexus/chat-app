const socketio = require('socket.io');

const {
    server
} = require('../exp');
const {
    addUser,
    getUser,
    removeUser,
    getUsersinRoom,
    getAllRooms
} = require('./users');

const io = socketio(server);

function generateMessage(msg) {
    const msgObject = {
        msg,
        timestamp: new Date().getTime()
    }
    return msgObject;
}

exports.ioConnection =
    io.on('connection', (socket) => {
        console.log('New webSocket connection established.');

        socket.on('join', ({ username, room, password }, callback) => {
            console.log(username, room, password);
            const {error, user, newroom} = addUser({ id: socket.id, username, room, password});

            if (error) {
                callback(error);
            }
            else {
                socket.join(newroom);

                socket.emit('new connection', {msg: generateMessage(newroom), rooms: getAllRooms(socket.id)});

                socket.broadcast.to(room).emit('new member', {
                    username: user.username,
                    room: newroom
                });

                socket.on('disconnect', () => {
                    console.log('Connection terminated.');
                    const user = removeUser(socket.id, password);
                    if (user) {
                        socket.broadcast.to(newroom).emit('user left', {
                            username: user.username,
                            room: newroom
                        });
                    }
                });
            }
        });

        socket.on('send message', (msgObject, callback) => {
            socket.broadcast.emit('receive message', msgObject);
            callback();
        });

        socket.on('send location', (loc) => {
            console.log(loc);
            socket.broadcast.emit('receive location', generateMessage(loc));
        });
    });

// exports.ioJoin = io.on('join', (socket) => {

//     console.log('New join request received.');

//     socket.emit('new connection', generateMessage('Welcome to the Chat Page.'));

//     socket.on('send message', (msgObject, callback) => {
//         socket.broadcast.emit('receive message', msgObject);
//         callback();
//     });

//     socket.on('send location', (loc) => {
//         console.log(loc);
//         socket.broadcast.emit('receive location', generateMessage(loc));
//     });

//     socket.on('disconnect', () => {
//         console.log('Connection terminated.');
//     });
// });