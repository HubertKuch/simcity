'use strict';

console.log(2);

document.querySelectorAll('.chunk').forEach(el => {
    el.addEventListener('click', (ev) => {
        console.log(ev.target);
    })
})