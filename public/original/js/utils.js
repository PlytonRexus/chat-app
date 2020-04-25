const wholeBody = document.querySelector('.whole');
const messageBox = document.querySelector('#messages');
const sendBtn = document.querySelector('#send-btn');
const imageBtn = document.querySelector('#image-btn');
const modalAlert = document.querySelector('#modal-alert');
const inputField = document.querySelector('#m-box');
const chatTitle = document.querySelector('.menu');
const chatsBox = document.querySelector('.chats');
var chat_sidebar = document.querySelector('.chat_sidebar');
var closeBtn = document.querySelector('#close-btn');
var chat_main = document.querySelector('.chat_main');
var room_search_bar = document.querySelector('#room_search_bar');
var room_add_btn = document.querySelector('.room_add_btn');
var closeOverlay = document.querySelector('#closeOverlay');
var list_title = document.querySelector('.list_title');

var number = 0;
var sent;
var myLocation;
var image;
var allRooms = new Array('one', 'onetwo', 'two', 'threetwo');

chatTitle.addEventListener('click', (e) => {
    e.preventDefault();
    if (window.innerWidth < 480) {
        chat_main.style.width = '0%';
        chat_sidebar.style.width = '100%';
        chat_sidebar.style.display = 'block';
        closeBtn.style['z-index'] = '2';
        room_search_bar.focus();
    }   
});

closeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (window.innerWidth < 480) {
        chat_sidebar.style.width = '0%';
        closeBtn.style['z-index'] = '-2';
        chat_sidebar.style.display = 'none';
    }
});

imageBtn.addEventListener('click', e => {
    var txt = "";
    if ('files' in imageBtn) {
    if (imageBtn.files.length == 0) {
      txt = "Select one or more files.";
    } else {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            document.getElementById('overlay-image').setAttribute('src', reader.result);
        });
        for (var i = 0; i < imageBtn.files.length; i++) {
            txt += "<br><strong>" + (i+1) + ". file</strong><br>";
            var file = imageBtn.files[i];
            if ('name' in file) {
              txt += "name: " + file.name + "<br>";
            }
            if ('size' in file) {
              txt += "size: " + parseInt(file.size/1024) + " Kbytes <br>";
            }
        }
        reader.readAsDataURL(file);
        document.getElementById("overlay-text").innerHTML = txt;
        overlay.style.display = 'block';
        closeOverlay.style['z-index'] = '2';
        image = file;
    }
    } 
    else {
        if (x.value == "") {
          txt += "Select one or more files.";
        } else {
          txt += "The files property is not supported by your browser!";
          txt  += "<br>The path of the selected file: " + imageBtn.value;
        }
    }
});


closeOverlay.addEventListener('click', (e) => {
    e.preventDefault();
    closeOverlay.style['z-index'] = '-2';
    overlay.style.display = 'none';
});

const importRooms = async () => {
    var url = location.protocol + '//' + location.hostname + ':' + location.port + '/rooms/all';
    var response = await fetch (url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        json = await response.json();
        allRooms = json.allRooms;
    }
    else {
        console.log('Error fetching rooms.');
    }
}

room_search_bar.addEventListener('keyup', (e) => {
    console.log(allRooms);
    var query = new RegExp(room_search_bar.value + '\\w+', 'gi');
    var relevant = new Array;
    var i = 0;
    while (i < allRooms.length) {
        var exists = query.test(allRooms[i].name);
        // console.log(allRooms[i], exists);
        if(exists) {
            relevant.push({room: allRooms[i].name});
        }
        i++;
    }
    console.log(query, relevant);
    chatsBox.innerHTML = '';
    if (relevant.length > 0) {
        arrangeRooms(relevant);
    }
    
});

// room_search_bar.addEventListener('blur', (e) => {
//     chatsBox.innerHTML = '';
//     loadRooms();
// });

list_title.addEventListener('click', async (e) => {
    chatsBox.innerHTML = '';
    await loadRooms();
})

room_add_btn.addEventListener('click', async (e) => {
    e.preventDefault();

    messageBox.innerHTML = '';
    room = room_search_bar.value.toLowerCase();
    room_search_bar.value = '';
    console.log(room, username);
    socket.emit('room changed', room);
    chatTitle.innerHTML = `${room}`;
    await loadHistory(room);
    chatsBox.innerHTML = '';
    await loadRooms(username);
});