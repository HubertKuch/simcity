'use strict';
const userService = new UserService('api/v1')

document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    userService    .login('test@mail.com', 'Testpass1234', 'wrong');
})
