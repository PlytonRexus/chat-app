var socket = io();

const wholeBody = document.querySelector('.whole');
const messageBox = document.querySelector('#messages');
const sendBtn = document.querySelector('#send-btn');
const locationBtn = document.querySelector('#location-btn');
const modalAlert = document.querySelector('#modal-alert');
const inputField = document.querySelector('#m-box');
const darkBtn = document.querySelector('#dark-mode');
var number;
var myLocation;

var dark = false;

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

// const addNewMessage = (message, date) => {
//     var li = document.createElement('li');
//     number = messageBox.children.length + 1;
//     li.setAttribute('id', 'msg-' + number);
//     li.setAttribute('class', 'not-my-msg');
//     li.appendChild(document.createTextNode(message));
//     messageBox.appendChild(li);
//     addReceipt(date);
// }

const addNewMessage = (message, date) => {
    var li = document.createElement('li');
    var span = document.createElement('span');
    number = messageBox.children.length + 1;
    li.setAttribute('id', 'msg-' + number);
    li.setAttribute('class', 'not-my-msg-cont');
    span.setAttribute('class', 'not-my-msg');
    span.appendChild(document.createTextNode(message));
    li.appendChild(span);
    messageBox.appendChild(li);
    addReceipt(date);
}

// const addMyMessage = (message) => {
//     var li = document.createElement('li');
//     number = messageBox.children.length + 1;
//     li.setAttribute('id', 'my-msg-' + number);
//     li.setAttribute('class', 'my-msg');
//     li.appendChild(document.createTextNode(message));
//     messageBox.appendChild(li);
// }

const addMyMessage = (message) => {
    var li = document.createElement('li');
    var span = document.createElement('span');
    number = messageBox.children.length + 1;
    li.setAttribute('id', 'my-msg-' + number);
    li.setAttribute('class', 'my-msg-container');
    span.setAttribute('class', 'my-msg');
    span.appendChild(document.createTextNode(message));
    li.appendChild(span);
    messageBox.appendChild(li);
}

// const addAcknowledgement = (message, date) => {
//     var li = document.createElement('li');
//     number = messageBox.children.length + 1;
//     li.setAttribute('id', 'acknowledgement-' + number);
//     li.setAttribute('class', 'acknowledgement');
//     li.appendChild(document.createTextNode(message + ' ' + date));
//     messageBox.appendChild(li);
// }

const addAcknowledgement = (message, date) => {
    var li = document.createElement('li');
    var span = document.createElement('span');
    number = messageBox.children.length + 1;
    li.setAttribute('id', 'acknowledgement-' + number);
    span.setAttribute('id', 'acknowledgement-text-' + number);
    li.setAttribute('class', 'acknowledgement-cont');
    span.setAttribute('class', 'acknowledgement');
    span.appendChild(document.createTextNode(message + ' ' + date));
    li.appendChild(span);
    messageBox.appendChild(li);
}

// const addReceipt = (date) => {
//     var li = document.createElement('li');
//     number = messageBox.children.length + 1;
//     li.setAttribute('id', 'receipt' + number);
//     li.setAttribute('class', 'receipt');
//     li.appendChild(document.createTextNode(date));
//     messageBox.appendChild(li);
// }

const addReceipt = (date) => {
    var li = document.createElement('li');
    var span = document.createElement('span');
    number = messageBox.children.length + 1;
    li.setAttribute('id', 'receipt-' + number);
    span.setAttribute('id', 'receipt-text-' + number);
    if (number == 1) {
        span.setAttribute('style', 'width: 0%');
    }
    li.setAttribute('class', 'receipt-cont');
    span.setAttribute('class', 'receipt');
    span.appendChild(document.createTextNode(date));
    li.appendChild(span);
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
    document.querySelector('#msg-' + number).scrollIntoView();
});

socket.on('receive location', (location) => {
    addNewMessage(location, new Date().getTime().toString());
    console.log(location);
});

sendBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const msg = inputField.value;
    inputField.value = '';
    if (msg == '') {
      return 0;
    }
    addMyMessage(msg, new Date().toString());
    socket.emit('send message', msg, () => {
        addAcknowledgement('Delivered.', new Date().toString());
    });

    document.querySelector('#my-msg-' + number).scrollIntoView();
    inputField.focus();
});

locationBtn.addEventListener('click', (e) => {
    e.preventDefault();
    myLocation = getLocation();
    if (myLocation) {socket.emit('send location', myLocation);}
});

darkBtn.addEventListener('mouseover', (e) => {
    e.preventDefault();
    if (dark) {
        messageBox.style.backgroundColor = 'black';
        document.body.style.backgroundColor = 'black';
        document.li.style.backgroundColor = 'black';
        document.input.style.backgroundColor = 'black';
        darkBtn.innerHTML = 'Light';
        dark = true;
    }
    else {
        messageBox.style.backgroundColor = 'white';
        document.body.style.backgroundColor = 'white';
        document.li.style.backgroundColor = 'white';
        document.input.style.backgroundColor = 'white';
        darkBtn.innerHTML = 'Dark';
        dark = false;
    }
})
