const username = document.querySelector('#username');
const password = document.querySelector('#password');
const room = document.querySelector('#room');
const submit = document.querySelector('#submit');

submit.addEventListener('click', (e) => {
    e.preventDefault();
    console.log(password.value);
});