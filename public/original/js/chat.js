const wholeBody = document.querySelector('.whole');
const messageBox = document.querySelector('#messages');
const sendBtn = document.querySelector('#send-btn');
const locationBtn = document.querySelector('#location-btn');
const modalAlert = document.querySelector('#modal-alert');
const inputField = document.querySelector('#m-box');
const chatTitle = document.querySelector('.name');
const chatsBox = document.querySelector('.chats');
var number = 0;
var myLocation;

window.onload = () => {
    inputField.focus();
    loadRooms();
}

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

const loadRooms = async () => {
    const allRooms = await getRooms(username);
    arrangeRooms(allRooms);
}

const getRooms = async (username) => {
    var url = location.protocol + '//' + location.hostname + ':' + location.port + '/rooms/';
    var authorization = location.pathname.toString();
    authorization = authorization.replace('/chat/', '');
    authorization = authorization.replace('/', '');
    const response = await fetch(url, {
        headers: {
            authorization
        }
    });

    if (response.ok) {
        const json = await response.json();
        return json.rooms;
    }
    else {
        return ['No Rooms Found or some error occured.'];
    }
}

const arrangeRooms = (allRooms) => {
    const appendToChatsBox = (item, index) => {
        var li = document.createElement('li');
        var a = document.createElement('a');
        li.setAttribute('id', 'room' + (index + 1).toString());
        li.setAttribute('class', 'room-cont');
        li.setAttribute('class', 'room_title');
        a.setAttribute('class', 'room');
        a.setAttribute('href', location.href.replace(room, item.room).toString());
        a.appendChild(document.createTextNode(item.room.toString().toUpperCase()));
        li.appendChild(a);
        chatsBox.appendChild(li);
    }
    allRooms.forEach(appendToChatsBox);
}

const addNewMessage = (message, date, username) => {
    var li = document.createElement('li');
    var span = document.createElement('span');
    number = messageBox.children.length + 1;
    li.setAttribute('id', 'not-my-msg-' + number);
    li.setAttribute('class', 'not-my-msg-cont');
    span.setAttribute('class', 'not-my-msg');
    span.appendChild(document.createTextNode(message));
    li.appendChild(span);
    messageBox.appendChild(li);
    addReceipt(username, date);
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
    var img = document.createElement('img');
    img.setAttribute('src', '/public/assets/img/checkmark.png');
    number = messageBox.children.length + 1;
    li.setAttribute('id', 'acknowledgement-' + number);
    span.setAttribute('id', 'acknowledgement-text-' + number);
    li.setAttribute('class', 'acknowledgement-cont');
    span.setAttribute('class', 'acknowledgement');
    span.appendChild(img);
    span.appendChild(document.createTextNode(' ' + date));
    li.appendChild(span);
    messageBox.appendChild(li);
}

const addReceipt = (username, date) => {
    var li = document.createElement('li');
    var span = document.createElement('span');
    var b = document.createElement('b');
    number = messageBox.children.length + 1;
    li.setAttribute('id', 'receipt-' + number);
    span.setAttribute('id', 'receipt-text-' + number);
    li.setAttribute('class', 'receipt-cont');
    span.setAttribute('class', 'receipt');
    b.appendChild(document.createTextNode(username.toString().toUpperCase()));
    span.appendChild(b);
    span.appendChild(document.createTextNode(` ${date}`));
    li.appendChild(span);
    messageBox.appendChild(li);
}

const printableTime = (timestamp) => {
    return moment(timestamp).format('ddd, MMM Do, hh:mm A');
}

document.addEventListener('DOMContentLoaded', function() {
    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
});

socket.on('count updated', (count) => {
    console.log('The count has been updated.', count);
});

socket.on('new connection', (object) => {
    const room = object.msg.msg;
    const rooms = object.rooms.rooms;
    chatTitle.innerHTML = `${room}`;
    addNewMessage(`Welcome to ${room}, ${username}!`, printableTime(object.msg.timestamp), object.username);
});

socket.on('user left', ({username, room}) => {
    chatTitle.innerHTML = `${room} | ${username} has just left.`;
    setTimeout(() => {
        chatTitle.innerHTML = `${room}`;
    }, 10000);
});

socket.on('receive message', (msgObject) => {
    //moment([2007, 0, 29]).fromNow();
    const message = msgObject.msg;
    const receivedFrom = msgObject.username;
    addNewMessage(message, printableTime(msgObject.timestamp), receivedFrom);
    document.querySelector('#receipt-' + number).scrollIntoView();
});

socket.on('receive location', (msgObject) => {
    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;

    var link = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;

    addNewMessage(link, printableTime(msgObject.timestamp));
});

socket.on('new member', ({username, room}) => {
    chatTitle.innerHTML = `${room} | ${username} has just joined.`;
    setTimeout(() => {
        chatTitle.innerHTML = `${room}`;
    }, 10000);
});

sendBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const msg = inputField.value;
    const timestamp = new Date().getTime();
    const msgObject = {
        username,
        msg,
        timestamp
    }
    inputField.value = '';
    
    if (msg == '') {
      return 0;
    }

    addMyMessage(msg);

    socket.emit('send message', msgObject, () => {
        addAcknowledgement('Delivered.', printableTime(msgObject.timestamp));
        document.querySelector('#acknowledgement-' + number).scrollIntoView();
    });

    inputField.focus();
});

locationBtn.addEventListener('click', (e) => {
    e.preventDefault();
    myLocation = getLocation();
    if (myLocation) {socket.emit('send location', myLocation);}
});

// const setSVG = () => {
//     var svg = document.createElement('svg');
//     var path1 = document.createElement('path');
//     var path2 = document.createElement('path');
//     svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
//     svg.setAttribute('viewBox', '0 0 512 512');
//     svg.setAttribute('width', '12px');
//     svg.setAttribute('height', '12px');
//     svg.setAttribute('fill', '#3AB37C');
//     path1.setAttribute('d', 'M424.3,180c-1-1.2-1.5-2.8-1.5-4.3c-14.8-26.1-15.7-58-30.5-84.1c-41.7,23.4-70.2,65.1-97.4,103.1c-16.4,22.9-31.1,46.4-44.6,71.1c-13.6,24.8-26.8,49.9-42,73.8c-2.2,3.4-7.9,5-10.3,0.7c-7.2-13.3-15.3-26.2-24.6-38.2c-8-10.3-17.1-19.5-25.3-29.6c-12.7-15.7-26.3-34.5-43.9-45.4c-6.4,21-13.9,41.8-17.2,63.6c24.6,15.9,43.4,38.9,61.5,61.6c21.2,26.6,43.1,52,66.9,76.3c15.4-20.1,26-43.5,38.8-65.3c15.1-25.7,32.7-49.4,51.4-72.6c18.7-23.2,40.3-43.7,62-63.9c10.2-9.5,22.2-17.3,33.1-26c8.2-6.6,16.2-13.4,23.7-20.7C424.4,180.2,424.4,180.1,424.3,180z');
//     path2.setAttribute('d', 'M436.2,170.3h-2.8c-16.3-27.7-16.2-62.6-34-89.9c-1.9-3-5.4-3.1-8.3-1.6c-45.6,23.1-76.2,67.7-105.2,108.1c-16.6,23.2-31.6,47-45.4,72c-12.3,22.3-24.1,44.8-37.4,66.6c-6-10.4-12.6-20.4-19.9-29.9c-8.2-10.8-17.8-20.3-26.3-30.8c-15.2-18.7-31.4-40.9-53.7-51.5c-3.7-1.8-7.4,0.5-8.5,4.2c-6.8,23.7-15.8,47-19.5,71.4c0,0.1,0,0.2,0,0.4c-2,2.7-2.2,7.1,1.6,9.4c26.5,15.6,46,40.8,64.9,64.6c22,27.7,45.2,54.1,70.2,79.1c2.3,2.3,6.4,1.8,8.4-0.5c17.2-20.6,28.7-45,41.8-68.2c14.7-25.9,32-50.3,51.1-73.2c19.2-22.9,40-43.7,61.9-64c10.4-9.7,22.6-17.7,33.8-26.6c9-7.2,17.7-14.7,25.9-22.8c2.3-0.5,4.2-2.1,4.6-4.7c0.6-0.6,1.2-1.3,1.8-1.9C445,176.1,441.2,170.3,436.2,170.3z M400.7,201c-10.9,8.7-22.8,16.5-33.1,26c-21.8,20.2-43.4,40.7-62,63.9c-18.7,23.2-36.3,46.8-51.4,72.6c-12.8,21.8-23.4,45.2-38.8,65.3c-23.8-24.2-45.8-49.7-66.9-76.3c-18.1-22.7-37-45.8-61.5-61.6c3.3-21.8,10.8-42.6,17.2-63.6c17.7,10.9,31.2,29.7,43.9,45.4c8.2,10.1,17.3,19.3,25.3,29.6c9.3,12,17.4,24.9,24.6,38.2c2.4,4.4,8.1,2.7,10.3-0.7c15.3-23.9,28.4-49,42-73.8c13.5-24.7,28.2-48.2,44.6-71.1c27.2-38,55.8-79.8,97.4-103.1c14.8,26.1,15.7,58,30.5,84.1c0,1.5,0.5,3.1,1.5,4.3c0,0.1,0.1,0.2,0.1,0.2C416.9,187.6,408.9,194.4,400.7,201z');
//     svg.appendChild(path1);
//     svg.appendChild(path2);
//     return svg;
// }

// darkBtn.addEventListener('mouseover', (e) => {
//     e.preventDefault();
//     if (dark) {
//         messageBox.style.backgroundColor = 'black';
//         document.body.style.backgroundColor = 'black';
//         document.li.style.backgroundColor = 'black';
//         document.input.style.backgroundColor = 'black';
//         darkBtn.innerHTML = 'Light';
//         dark = true;
//     }
//     else {
//         messageBox.style.backgroundColor = 'white';
//         document.body.style.backgroundColor = 'white';
//         document.li.style.backgroundColor = 'white';
//         document.input.style.backgroundColor = 'white';
//         darkBtn.innerHTML = 'Dark';
//         dark = false;
//     }
// });