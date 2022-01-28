'use strict';

document.querySelectorAll('.chunk-container').forEach(el => {
    el.addEventListener('click', (ev) => {
        document.querySelectorAll('.marked-chunk').forEach(marked => marked.classList.remove('marked-chunk'));
        ev.target.classList.add('marked-chunk');

        const placeId = ev.target.parentElement.id.replace(/\D/g, '') * 1;
        sessionStorage.setItem('markedId', placeId);
    });
});
