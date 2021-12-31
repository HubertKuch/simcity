'use strict';
const userService = new UserService('api/v1')




document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    userService.login(email, password, '#error-field');
})
