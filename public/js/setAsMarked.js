'use strict';

const mapCTX = $('#map-ctx');

const tilesInAxis = {
    x: Math.floor(mapCTX.width / 32),
    y: Math.floor(mapCTX.height / 32) - 1,
};

$('#marked-ctx').addEventListener('click', (e) => {
    const x = e.clientX;
    const y = e.clientY - 50;


    const yRow = Math.floor((y / 32) + 1);
    const xField = Math.floor((x / 32) + 1);

    const placeID = Math.floor(
        Math.abs(
            xField + (tilesInAxis.x * ( yRow - 1 ))
        )
    );

    sessionStorage.setItem('place-id', `${placeID}`);
});
