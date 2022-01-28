'use strict';

const $ = q => document.querySelector(q);

const myCity = $('#nav-my-city');
const quests = $('#nav-quests');
const friends = $('#nav-friends');
const myAccount = $('#nav-my-account');
const help = $('#nav-help');

const endpointsList = [ myCity, quests, friends, myAccount, help ];


const handler = (e) => {
    let id = e.target.id;
    let to = e.target.getAttribute('data-to');

    if (e.target.id === '' || !to) {
        id = e.target.parentElement.id;
        to = e.target.parentElement.getAttribute('data-to')
    }

    endpointsList.forEach(endpoint => {
        $(endpoint.getAttribute('data-to')).style.display = 'none';

    });

    $(to).style.display = 'block';
};

endpointsList.
    forEach(e => e.addEventListener('click', handler));
