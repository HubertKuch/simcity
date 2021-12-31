'use strict';

document.querySelector('.logout-button').addEventListener('click', () => {
    new UserService('api/v1').logout();
    window.location.replace('/login')
});
