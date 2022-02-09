const allCanvases = $$('canvas');
const mapCanvas = $('#map-ctx');
const ctx = mapCanvas.getContext('2d', { alpha: false });

let tilemapData = {};

window.addEventListener('resize', () => {
    resizeCanvas();
    drawTilemap(tilemapData.tilemap, tilemapData.tileTypes);
    drawBuildingTilemap(tilemapData.buildingData);
});

const resizeCanvas = () => {
    allCanvases.forEach(canvas => {
        canvas.height = tilemapData.tilemap.length * 32;
        canvas.width = tilemapData.tilemap[0].length * 32;
    })
}

const drawTilemap = (tilemap, tileTypes) => {
    tilemapData['tilemap'] = tilemap;
    tilemapData['tileTypes'] = tileTypes;
    resizeCanvas();
    let x = 0, y = 0;

    const waitForLoad = setInterval(() => {
        if (!tilemap || !tileTypes) {
            return;
        }

        let i = -46;

        for (const row of tilemap) {
            for (const el of row) {
                for (const type of tileTypes) {
                    if (type[0] === el) {
                        const img = new Image();
                        img.src = `/sprites/${type[1]}.png`;
                        ctx.drawImage(img, x, y, 32, 32);
                    }
                }
                i++;
                x += 32;
            }
            x = 0;
            y += 32;
        }

        clearInterval(waitForLoad);
    }, 50)
}

const drawBuildingTilemap = (data) => {
    const buildingCanvas = $('#building-ctx');
    const buildingCtx = buildingCanvas.getContext('2d');
    const imageSourceTemplate = (name) => `/sprites/${name}`;
    tilemapData['buildingData'] = data;

    for (const building of data) {
        const buildingImage = new Image();
        const placeID = building.placeId;
        const width = 32;
        const height = 32;
        const tilesInXAxis = Math.floor((buildingCanvas.width / 32) - 1);
        const y = Math.floor((placeID / tilesInXAxis) + 1);
        const x = Math.floor(placeID % tilesInXAxis);
        const xpx = (x * 32) - 32;
        const ypx = (y * 32) - 32;

        buildingImage.src = imageSourceTemplate(building.img);
        buildingImage.onload = () => {
            buildingCtx.drawImage(buildingImage, xpx, ypx, width, height);
        }
    }
}
