'use strict';

$('#marked-ctx').addEventListener('click', (e) => {
    const x = e.clientX;
    const y = e.clientY - 50;
    const mapCTX = $('#map-ctx');
    const tilesInAxis = {
        x: Math.floor(mapCTX.offsetWidth / 32) - 1,
        y: Math.floor(mapCTX.offsetHeight / 32) - 2,
    };

    const yRow = Math.floor((y / 32) + 1);
    const xField = Math.floor((x / 32) + 1);

    const placeID = Math.floor(
        Math.abs(
            xField + (tilesInAxis.x * ( yRow - 1 ))
        )
    );

    sessionStorage.setItem('place-id', `${placeID}`);
});
