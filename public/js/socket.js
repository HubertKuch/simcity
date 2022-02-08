'use strict';

const socket = io();

// TILEMAP
socket.on('server:tileMap', ({ tilemap, tileTypes}) => {
    if (tilemap && tileTypes) {
        drawTilemap(tilemap, tileTypes);
        drawTilemap(tilemap, tileTypes);
        drawTilemap(tilemap, tileTypes);
        drawTilemap(tilemap, tileTypes);
        drawTilemap(tilemap, tileTypes);
    }
});

// ROUNDS
socket.on('server:nextRound', (infoObj) => {
    for (const field in infoObj) {
        const container = $(`#${field}`);
        container ? container.textContent = infoObj[field] : null;
    }
});

$('.next-round-button').addEventListener('click', () => {
    socket.emit("client:nextRound")
});

const prepareBuildingElement = ({ id, img, name, price, lvl }) => {
    return `<div class="new-building"  data-buildingId="${id}" style="background: inherit;">
            <img src="/sprites/${img}" style="height: 32px;width: 32px;" alt=""/><br/>
            <span class="building-name">${name}</span><br/>
            <span class="building-price">price: ${price}</span><br/>
            <span class="building-rpice">Required lvl: ${lvl}</span>
        </div>`
}

socket.on('server:buildingList', (data) => {
    const list = $('.buildings-to-buy');
    for (const building of data) {
        const  data = {
            id: building._id,
            name: building.name,
            price: building.cost,
            lvl: building.requiredLevel,
            img: building.img,
        };

        const preparedBuildingElement = prepareBuildingElement(data);
        list.innerHTML += preparedBuildingElement;
    }
});

socket.on('server:provideBuildings', drawBuildingTilemap);

socket.on('server:build', () => {});

socket.on('server:getQuests', ({ completed, nonCompleted }) => {
    const nonCompletedContainer = $('.non-completed-quests');
    const completedContainer = $('.completed-quests');

    nonCompletedContainer.innerHTML = null;
    completedContainer.innerHTML = null;

    const nonCompletedTitle = document.createElement('span');

    nonCompletedTitle.textContent = 'NON COMPLETED';
    nonCompletedTitle.appendChild(document.createElement('br'));
    nonCompletedTitle.appendChild(document.createElement('br'));

    const completedTitle = document.createElement('span');
    completedTitle.appendChild(document.createElement('br'));

    completedTitle.textContent = 'COMPLETED';
    completedTitle.appendChild(document.createElement('br'));
    completedTitle.appendChild(document.createElement('br'));


    nonCompletedContainer.appendChild(nonCompletedTitle);
    completedContainer.appendChild(completedTitle);

    const questDescNameEl = $('.quest-desc-name');
    const questDescEl = $('.quest-desc');
    const award = $('.award');

    questDescNameEl.textContent = nonCompleted[0]?.name ?? 'You end all the quests. Congratulations.';
    questDescEl.textContent = nonCompleted[0]?.description ?? 'If you want you can propose new quests and I will add it.';
    award.textContent = `Exp: ${nonCompleted[0]?.expAward ?? ''} Money: ${nonCompleted[0]?.moneyAward ?? ''}`;

    function createNewQuest({ _id, name, description, expAward, moneyAward }) {
        const quest = document.createElement('div');
        const questName = document.createElement('span');

        quest.classList.add('quest');
        quest.setAttribute('data-name', name);
        quest.setAttribute('data-quest-id', _id);
        questName.classList.add('quest-name');
        questName.textContent = name;

        questName.addEventListener('click', () => {
            questDescNameEl.textContent = name;
            questDescEl.textContent = description;
            award.textContent = `Exp: ${expAward} Money: ${moneyAward}`;
        });

        quest.appendChild(questName);

        return quest;
    }

    for (const quest of completed)
        completedContainer.appendChild(createNewQuest(quest));

    for (const quest of nonCompleted)
        nonCompletedContainer.appendChild(createNewQuest(quest));
});

const waitForList = setInterval(()=> {
    const query = '.new-building'
    let list = document.querySelectorAll(query);

    if (list.length === 0) {
        list = document.querySelectorAll(query);
        return;
    }

    clearInterval(waitForList)

    list.forEach(el => {
        el.addEventListener('click', (ev) => {
            let placeId = sessionStorage.getItem('place-id');
            let buildingId = ev.target.getAttribute('data-buildingId');

            if (!ev.target.classList.contains('new-building')) {
                const parent = ev.target.parentElement;
                buildingId = parent.getAttribute('data-buildingId')
            }

            socket.emit('client:build', { placeId, buildingId });
        });
    });

}, 50);



socket.on('server:notification', ({ title, description }) => {
    const notificationElement = (title, description) => `
        <div data-notification-title="${title}" class="notification">
            <div class="notification-title">${title}</div>
            <div>${description}</div>
        </div>
    `;

    $('.notification-stack').innerHTML += notificationElement(title, description);

    setTimeout(() =>{
        $(`[data-notification-title="${title}"]`).remove();
    }, 5000);
});

// FRIENDS
$('.friends-search input').addEventListener('input', (e) => {
   socket.emit('client:searchFriends', { token: e.target.value });
});

socket.on('server:searchFriends', ({ users }) => {
    const container = $('.searched-friends');

    container.innerHTML = null;

    if (users.length === 0) {
        container.innerHTML += ``;
    }

    for (const user of users) {
        container.innerHTML += `
            <div class="friend searched-friend" data-user-id="${user._id}">
                <span class="friend-name searched-friend-name">${user.username}</span>
                <i class="fas fa-plus"></i>
            </div>
        `;
    }

    $$('.searched-friend i').forEach(sFriend => {
        sFriend.addEventListener('click', (e) => {
            let _id = e.target.getAttribute('data-user-id');

            if (!_id) {
                _id = e.target.parentElement.getAttribute('data-user-id');
            }

            socket.emit('client:addFriend', _id);
        });
    });
});

socket.on('server:getFriends', ({ friends }) => {
    const container = $('.friends-section-your-friends');

    container.innerHTML = null;

    if (friends.length === 0) {
        container.textContent = `You don't have friends yet.`;
    }

    for (const { username, isActive } of friends) {
        const friend = document.createElement('div');
        const friendName = document.createElement('span');
        const isFriendActive = document.createElement('span');

        friend.classList.add('friend');
        friendName.textContent = username;
        isFriendActive.classList.add('is-active', isActive ? 'active' : 'non-active');

        friend.appendChild(friendName);
        friend.appendChild(isFriendActive);

        container.appendChild(friend);
    }
});

socket.on('server:getInvitations', ({ invitations }) => {
    const container = $('.friends-section-invitations');
    container.innerHTML = null;

    if (invitations.length === 0) {
        const emptyMessage = document.createElement('span');
        emptyMessage.textContent = 'You don\'t have any invitation.';
        container.appendChild(emptyMessage);
        return;
    }

    for (const { username, _id } of invitations) {
        const friendInvitation = document.createElement('div');
        const accept = document.createElement('i');
        const reject = document.createElement('i');
        const usernameElement = document.createElement('span');

        friendInvitation.classList.add('friend', 'friend-invitation');
        friendInvitation.setAttribute('data-user-id', _id);
        accept.classList.add('fas', 'fa-check', 'accept');
        reject.classList.add('fas', 'fa-times', 'reject');
        usernameElement.textContent = username;

        accept.addEventListener('click', () => {
            socket.emit('client:acceptInvitation', _id);
        });

        reject.addEventListener('click', () => {
            socket.emit('client:rejectInvitation', _id);
        });

        friendInvitation.appendChild(usernameElement);
        friendInvitation.appendChild(accept);
        friendInvitation.appendChild(reject);

        container.appendChild(friendInvitation);
    }
});

socket.on('server:getFriendCode', ({ code }) => {
    $('.friend-code .code').textContent = code;
});

socket.on('server:getTopPlayers', ({ topPlayers }) => {
    const table = $('.top-players-table');
    const headerRow = document.createElement('tr');
    table.innerHTML = null;

    const rank = document.createElement('th');
    rank.textContent = 'Rank';
    headerRow.appendChild(rank);

    for (const field in topPlayers[0]) {
        const header = document.createElement('th');

        header.textContent = field;
        headerRow.appendChild(header);
    }

    table.appendChild(headerRow);

    let placeNumber = 1;
    for (const player of topPlayers) {
        const row = document.createElement('tr');
        const place = document.createElement('th');
        place.textContent = placeNumber;
        row.appendChild(place);

        for (const field in player) {
            const column = document.createElement('td');

            column.textContent = Array.isArray(player[field]) ? player[field].length : player[field];
            row.appendChild(column);
        }

        table.appendChild(row);
        placeNumber += 1;
    }
});
