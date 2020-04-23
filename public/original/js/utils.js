var chat_sidebar = document.querySelector('.chat_sidebar');
var closeBtn = document.querySelector('.closeBtn');
var chat_main = document.querySelector('.chat_main');
var room_add_bar = document.querySelector('.room_add_bar');

chatTitle.addEventListener('click', (e) => {
    e.preventDefault();
    if (window.innerWidth < 480) {
        chat_main.style.width = '0%';
        chat_sidebar.style.width = '100%';
        chat_sidebar.style.display = 'block';
        closeBtn.style['z-index'] = '2';
        room_add_bar.focus();
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