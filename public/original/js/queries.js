var socket = io();

var token = location.pathname.toString();
    token = token.replace('/chat/', '');
    token = token.replace('/', '');

const decoded = jwt_decode(token);

const {username, room} = decoded;

socket.emit('join', {room, username}, (error) => {
    location.href = '/';
});