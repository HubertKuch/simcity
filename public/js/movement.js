'use strict';

let movement = { xStart: 0, yStart: 0, xPos: 0, yPos: 0 };
let isDown = false;
const maxYMove = tilesInAxis.y * 32 - 64;
const maxXMove = tilesInAxis.x * 32 - 32;

const map = $('canvas#marked-ctx');

map.addEventListener('mousedown', (ev) => {
    movement.xStart = ev.clientX;
    movement.yStart = ev.clientY;

    isDown = true;
}, true);

map.addEventListener('mousemove', (ev) => {
    if (isDown) {
        allCanvases.forEach(() => {
            let xMove = (ev.movementX + movement.xPos);
            let yMove = (ev.movementY + movement.yPos);

            if (yMove >= 50) yMove = 50;
            if (-yMove >= maxYMove) yMove = -maxYMove;

            if (xMove >= 0)  xMove = 0;
            if (-xMove >= maxXMove) xMove = -maxXMove;

            for (const canvas of allCanvases) {
                canvas.style.left = `${xMove}px`;
                canvas.style.top = `${yMove}px`;
            }

            movement.yPos = yMove;
            movement.xPos = xMove;
        });
    }
});

map.addEventListener('mouseup', () => isDown = false, true);

