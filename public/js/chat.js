var socket = io();

const messageArea = document.querySelector('.message-display-area');
const mapLink = document.querySelector('#mapLink');

//// TEMPLATES
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML;

sendBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const msg = inputField.value;
    const timestamp = new Date().getTime();
    msgObject = {
        msg,
        timestamp
    }
    if (msg == '') {
        return 0;
    }

    socket.emit('send message', msgObject, () => {
        inputField.focus();
        inputField.value = '';
        return printMessage(msgObject);
    });
});

socket.on('receive message', (message) => {
    printMessage(message);
});

socket.on('new connection', (message) => {
    printMessage(message);
});

socket.on('receive location', (location) => {
    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;

    link = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;

    var data = {
        mapMessage: 'Location of Sender.',
        mapLink: link
    };

    const html = Mustache.render(locationMessageTemplate, data);
    messageArea.insertAdjacentHTML('beforeend', html);
});

locationBtn.addEventListener('click', (e) => {
    e.preventDefault();
    myLocation = getLocation();
    if (myLocation) {
        socket.emit('send location', myLocation);
    }
    else {
        alert('Some error occured while fetching location.');
    }
});

const printableTime = (timestamp) => {
    return moment(timestamp).format('ddd, MMM Do, hh:mm A');
}

function printMessage(msgObject) {
    var data = {
        message: msgObject.msg,
        time: printableTime(msgObject.timestamp)
    };
    console.log(msgObject);
    console.log(data.msg);
    const html = Mustache.render(messageTemplate, data);
    messageArea.insertAdjacentHTML('beforeend', html);
}