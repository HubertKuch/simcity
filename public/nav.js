'use strict';

const actions = [
    {
        selector: "#nav-quests",
        event: "click",
        socketAction: "client:getQuests",
    }
];

for (const action of actions) {
    $(action.selector)
        .addEventListener(action.event, () => socket.emit(action.socketAction));
}

const endpointsList = $$(`[id^="nav-"]`)

const handler = (e) => {
    let to = e.target.getAttribute('data-to');
    let id = e.target.id;

    if (e.target.id === '' || !to) {
        id = e.target.parentElement.id;
        to = e.target.parentElement.getAttribute('data-to')
    }

    endpointsList.forEach(endpoint => {
        $(endpoint.getAttribute('data-to')).style.display = 'none';
    });

    $(to).style.display = 'block';
};

endpointsList
    .forEach(e => e.addEventListener('click', handler));

