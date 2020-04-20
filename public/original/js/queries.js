var socket = io();

const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true});
socket.emit('join', {username, room, password: 'password'}, (error) => {
    location.href = '/';
});