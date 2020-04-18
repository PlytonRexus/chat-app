var socket = io();

const messageBox = document.querySelector('#messages');
const sendBtn = document.querySelector('#send-btn');
const locationBtn = document.querySelector('#location-btn');
const modalAlert = document.querySelector('#modal-alert');
const inputField = document.querySelector('#m-box');
var number;
var myLocation;

function error () {
    console.log('Could not retrieve location.');
    throw new Error ('Could not retrieve location.');
}

function getLocation () {
    if (!navigator.geolocation) {
        alert ('Browser does not support geolocation.');
    }
    else {
        navigator.geolocation.getCurrentPosition((position) => {
            return position;
        },
        error);
    } 
}

const addNewMessage = (message, date) => {
    var li = document.createElement('li');
    number = messageBox.children.length + 1;
    li.setAttribute('id', 'msg-' + number);
    li.setAttribute('class', 'not-my-msg');
    li.appendChild(document.createTextNode(message + ' ' + date));
    messageBox.appendChild(li);
}

const addMyMessage = (message) => {
    var li = document.createElement('li');
    number = messageBox.children.length + 1;
    li.setAttribute('id', 'my-msg-' + number);
    li.setAttribute('class', 'my-msg');
    li.appendChild(document.createTextNode(message));
    messageBox.appendChild(li);
}

const addAcknowledgement = (message, date) => {
    var li = document.createElement('li');
    number = messageBox.children.length + 1;
    li.setAttribute('id', 'acknowledgement' + number);
    li.setAttribute('class', 'acknowledgement');
    li.appendChild(document.createTextNode(message + ' ' + date));
    messageBox.appendChild(li);
}

document.addEventListener('DOMContentLoaded', function() {
    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
});

socket.on('count updated', (count) => {
    console.log('The count has been updated.', count);
});

socket.on('new connection', (message) => {
    addNewMessage(message, new Date().toString());
});

socket.on('receive message', (message) => {
    addNewMessage(message, new Date().toString());
});

socket.on('receive location', (location) => {
    addNewMessage(location, new Date().getTime().toString());
    console.log(location);
});

sendBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const msg = inputField.value;
    addMyMessage(msg, new Date().toString());
    socket.emit('send message', msg, () => {
        // socket.emit('acknowledgement', 'Sent.');
        addAcknowledgement('Delivered', new Date().toString());
    });
    socket.emit('increment');
    inputField.value = '';
});

locationBtn.addEventListener('click', (e) => {
    e.preventDefault();
    myLocation = getLocation();
    if (myLocation) {socket.emit('send location', myLocation);}
});