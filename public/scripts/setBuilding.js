'use strict';

document.querySelectorAll('.chunk').forEach(el => {
    el.addEventListener('click', (ev) => {
        console.log(ev.target);
    })
})