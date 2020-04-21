var socket = io();

const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true});
socket.emit('join', {room, username}, (error) => {
    location.href = '/';
});