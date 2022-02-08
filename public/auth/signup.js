'use strict';

document.querySelector('form').addEventListener('submit', () => {
    const username = document.querySelector("#username").value;
    const password = document.querySelector('#password').value;
    const email = document.querySelector('#email').value;
    const passwordConfirm = document.querySelector('#confirm-password').value;

    axios.post('/api/v1/users/signup', {
        email,
        password,
        passwordConfirm,
        username
    });
});
