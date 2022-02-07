'use strict';

$('.copy').addEventListener('click', () => {
    writeToClipboard($('.friend-code .code').textContent.trim());
});

$('.generate-new-friend-code').addEventListener('click', () => {
    socket.emit('client:generateNewFriendCode');
});
