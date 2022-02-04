import app from './app';
import writeLog from './utils/writeLog';
import { Server, Socket } from 'socket.io';
import http from 'http';
import { promisify } from "util";
import jwt from 'jsonwebtoken';
import User from "./models/UserModel";
import RoundController from "./controllers/RoundController";
import { BuildingController } from './controllers/BuildingController';
import Building from "./models/BuildingModel";
import Quest from "./models/Quest";
import NotificationService from "./services/NotificationService";
import { tilemap, tileTypes } from "./map/tilemap";

const server: http.Server = http.createServer(app);
const io = new Server(server);

// SOCKET
io.on('connection', async (socket: Socket) => {
    const cookies: string[] | undefined = socket.handshake.headers?.cookie?.split(";");
    const tokenCookie: string | undefined = cookies?.filter(cookie => cookie.trim().startsWith("token"))[0];
    const token: string | undefined = tokenCookie?.substring(6, tokenCookie?.length);

    if (!token) {
        io.emit("ERROR:AUTH");
        io.close();
    }

    // @ts-ignore
    const decodedData: any = await promisify(jwt.verify)(token, process.env.JWT_SECRET!);
    const userId: string = decodedData.id;
    const user: any = await User.findById(userId);

    const roundController: RoundController = new RoundController(user);
    const buildingController: BuildingController = new BuildingController(user);
    const notificationService: NotificationService = new NotificationService(socket);

    // ON CONNECTION
    socket.emit('server:nextRound', { info: roundController.makeInfoObject() })
    socket.emit('server:buildingList', await Building.find({}));
    socket.emit('server:provideBuildings', user.building);
    socket.emit('server:tileMap', { tilemap, tileTypes });

    // NEXT ROUND
    socket.on('client:nextRound', () => {
        const questsBeforeNextRound: Array<Quest> = user.quests;

        roundController.nextRound();
        socket.emit('server:nextRound', roundController.makeInfoObject());

        const questsAfterNextRound: Array<Quest> = user.quests;

        for (const before of questsBeforeNextRound)
            for (const after of questsAfterNextRound)
                if (before.isComplete != after.isComplete)
                    notificationService.sendNotification(after.name, after.description);

    });

    // BUILD
    socket.on('client:build', (data) => {
        buildingController.buildBuilding(data.buildingId, data.placeId);

        socket.emit('server:build');
        socket.emit('server:provideBuildings', user.building);
    });

    // QUESTS
    socket.on('client:getQuests', () => {
        socket.emit('server:getQuests', {
            completed: [...user.quests.filter((q: Quest) => q.isComplete)],
            nonCompleted: [...user.quests.filter((q: Quest) => !q.isComplete)],
        });
    });

    // HELP
    socket.on('client:help', () => {})

    // SETTINGS
    socket.on('client:settings', () => {})
})


server.listen(process.env.PORT, () =>
    console.log(`server listen on ${process.env.PORT} | ${process.env.NODE_ENV} SERVER`)
);

process.on('uncaughtException', (err) => {
    writeLog(err);
    console.log(err);
    process.exit(1);
});
