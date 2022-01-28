'use strict';

const socket = io();

function findPlaceByIdAndPutBuilding(id, img) {
    const tile = document.querySelector(`#place-${id}`);

   if (tile) {
       tile.innerHTML += `<img class="building" style="position: relative; width: 48px; left: -50px;" src="/sprites/${img}"  alt=""/>`;
   } else {
       console.log('ERROR')
   }
}

// ROUNDS
socket.on('server:nextRound', (infoObj) => {
    for (const field in infoObj) {
        const container = document.querySelector(`#${field}`);
        container ? container.textContent = infoObj[field] : null;
    }
});

document.querySelector('.next-round-button').addEventListener('click', () => {
    socket.emit("client:nextRound")
});

const prepareBuildingElement = ({ id, img, name, price, lvl }) => {
    return `<div class="new-building"  data-buildingId="${id}" style="background: inherit;">
            <img src="/sprites/${img}" style="height: 64px;width: 64px;" alt=""/><br/>
            <span class="building-name">${name}</span><br/>
            <span class="building-price">price: ${price}</span><br/>
            <span class="building-rpice">Required lvl: ${lvl}</span>
        </div>`
}

socket.on('server:buildingList', (data) => {
    const list = document.querySelector('.buildings-to-buy');
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

socket.on('server:provideBuildings', (data) => {
    document.querySelectorAll('.building').forEach(el => {
        el.remove();
    });

    for (const building of data) {
        findPlaceByIdAndPutBuilding(building.placeId, building.img)
    }
});

// BUILD
socket.on('server:build', () => {

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
            let placeId = sessionStorage.getItem('markedId');
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
