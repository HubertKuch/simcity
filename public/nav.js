'use strict';

const actions = [
    {
        selector: "#nav-quests",
        event: "click",
        socketAction: "client:getQuests",
        innerActions: []
    },
    {
        selector: "#nav-friends",
        event: 'click',
        socketAction: 'client:getFriends',
        innerActions: [
            {
                selector: '.friends-section-your-friends',
                event: 'click',
                socketAction: '',
                eventSelector: '.friends-nav-your-friends'
            },
            {
                selector: '.friends-section-find-friend',
                event: 'click',
                socketAction: '',
                eventSelector: '.friends-nav-find-friend',
            },
            {
                selector: '.friends-section-invitations',
                event: 'click',
                socketAction: 'client:getInvitations',
                eventSelector: '.friends-nav-invitations',
            },
            {
                selector: '.friends-section-top-players',
                event: 'click',
                socketAction: 'client:getTopPlayers',
                eventSelector: '.friends-nav-top-players'
            },
            {
                selector: '.friends-section-your-friend-code',
                event: 'click',
                socketAction: 'client:getFriendCode',
                eventSelector: '.friends-nav-your-friend-code'
            },
        ]
    },
];

for (const action of actions) {
    const currentSection = $(action.selector);
    const firstSection = $(action.innerActions[0]?.selector);

    currentSection.addEventListener(action.event, () => socket.emit(action.socketAction));
    if (firstSection) {
        firstSection.style.display = 'block';
    }

    const innerSections = action.innerActions.map(action => $(action.selector));

    for (const innerAction of action.innerActions) {
        $(innerAction.eventSelector).addEventListener(innerAction.event, () => {
            innerSections.forEach(section =>
                section.style.display = 'none'
            );

            if (innerAction.socketAction !== '') {
                socket.emit(innerAction.socketAction);
            }

            $(innerAction.selector).style.display = 'block'
        });
    }
}

const endpointsList = $$(`[id^="nav-"]`)

const actionEventHandler = (e) => {
    let to = e.target.getAttribute('data-to');

    if (e.target.id === '' || !to) {
        to = e.target.parentElement.getAttribute('data-to')
    }

    const toSection = $(to);

    endpointsList.forEach(endpoint => {
        $(endpoint.getAttribute('data-to')).style.display = 'none';
    });
    
    toSection.style.display = 'block';
};

endpointsList
    .forEach(e => e.addEventListener('click', actionEventHandler));
