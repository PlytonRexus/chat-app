var socket = io();

const messageBox = document.querySelector('#messages');
const send = document.querySelector('#send-btn');
var number;

socket.on('count updated', (count) => {
    console.log('The count has been updated.', count);
});

socket.on('new connection', (message) => {
    addNewMessage(message, new Date().toString());
});

socket.on('receive message', (message) => {
    addNewMessage(message, new Date().toString());
});

const addNewMessage = (message, date) => {
    var li = document.createElement('li');
    number = messageBox.children.length + 1;
    li.setAttribute('id', 'msg-' + number);
    li.appendChild(document.createTextNode(message + ' ' + date));
    messageBox.appendChild(li);
}

send.addEventListener('click', function (e) {
    const inputField = document.querySelector('#m');
    const msg = inputField.value;
    e.preventDefault();
    socket.emit('send message', msg);
    socket.emit('increment');
});