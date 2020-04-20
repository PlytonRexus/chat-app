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
