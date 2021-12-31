'use strict';

function dragMovement (e) {
    console.log(e.x);
}

document.addEventListener('touchstart', dragMovement);
