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

    nonCompletedContainer.innerHTML = 'NON COMPLETED <br><br>';
    completedContainer.innerHTML = 'COMPLETED <br><br>';

    const questDescNameEl = $('.quest-desc-name');
    const questDescEl = $('.quest-desc');
    const award = $('.award');

    if(nonCompleted[0]) {
        questDescNameEl.textContent = nonCompleted[0].name;
        questDescEl.textContent = nonCompleted[0].description;
        award.textContent = `Exp: ${nonCompleted[0].expAward} Money: ${nonCompleted[0].moneyAward}`;
    }

    const newQuestElement = ({ _id, name }) => `
        <div class="quest" data-name="${name}" data-quest-id="${_id}">
            <span class="quest-name">${name}</span>
        </div>`;

    for (const quest of completed)
        completedContainer.innerHTML += newQuestElement(quest);

    for (const quest of nonCompleted)
        nonCompletedContainer.innerHTML += newQuestElement(quest);

    nonCompletedContainer.innerHTML += '<hr>';

    [...$$('.quest')].forEach(q => q.addEventListener('click', () => {
        const questId = q.getAttribute('data-quest-id');
        const questData = [...completed, ...nonCompleted].filter(q => q._id === questId)[0];

        if (questData) {
            questDescNameEl.textContent = questData.name;
            questDescEl.textContent = questData.description;
            award.textContent = `Exp: ${questData.expAward} Money: ${questData.moneyAward}`;
        }
    }));
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

socket.on('server:destroy');

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
