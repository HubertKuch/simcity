const tilemap = [
    [0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 9, 13, 13, 13, 13, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 8, 1, 1, 1, 1, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 8, 1, 1, 1, 1, 1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 7, 3, 3, 3, 3, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const tilesTypes = [
    [0, 'water_sprite_01'],
    [1, 'grass_sprite_01'],
    [2, 'grass_water_all_sprite_01'],
    [3, 'grass_water_bottom_sprite_01'],
    [4, 'grass_water_bottom_top_left_sprite_01'],
    [5, 'grass_water_bottom_top_right_sprite_01'],
    [6, 'grass_water_bottom_top_sprite_01'],
    [7, 'grass_water_left_bottom_sprite_01'],
    [8, 'grass_water_left_sprite_01'],
    [9, 'grass_water_left_top_sprite_01'],
    [10, 'grass_water_right_bottom_sprite_01'],
    [11, 'grass_water_right_sprite_01'],
    [12, 'grass_water_right_top_sprite_01'],
    [13, 'grass_water_top_sprite_01'],
];

const specialTilesTypes = [
    [0, 'energy_fan_sprite_01'],
]

const map = document.querySelector('.map');

function setTile (row, typeId, placeId, actualIndex, actualRow, tilename) {
    if (row.length === actualIndex) {
        map.innerHTML += '<br>';
    }

    map.innerHTML += `
        <span id="place-${placeId}" data-typeId="${typeId}" class="chunk-container">
             <img 
                class="chunk" 
                draggable="false" 
                src='/sprites/${tilename}.png'
                alt=""
            />
        </span>
    `;
}

function provideTilemap (tilemap) {
    let elementIndex = 0;
    let placeId = 0;
    let rowIndex = 0;
    for (const row of tilemap) {
        for (const element of row) {
            for (const tileTypeRow of tilesTypes) {
                if (tileTypeRow[0] === element) {
                    setTile(row, tileTypeRow[0], placeId, elementIndex, rowIndex, tileTypeRow[1]);
                }
            }

            (elementIndex === row.length) ? elementIndex = 0:null;
            elementIndex+=1;
            placeId+=1;
        }

        rowIndex+=1;
    }
}

provideTilemap(tilemap);
