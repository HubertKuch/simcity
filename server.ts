import app from './app';
import writeLog from './utils/writeLog';
import { Server, Socket } from 'socket.io';
import http from 'http';
import { promisify } from "util";
import jwt from 'jsonwebtoken';
import User from "./models/user.schema";
import RoundController from "./controllers/round.controller";
import { BuildingController } from './controllers/building.controller';
import Building from "./models/building.schema";

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

    // ON CONNECTION
    socket.emit('server:nextRound', { info: roundController.makeInfoObject() })
    socket.emit('server:buildingList', await Building.find({}));
    socket.emit('server:provideBuildings', user.building);

    // NEXT ROUND
    socket.on('client:nextRound', () => {
        roundController.nextRound();
        socket.emit('server:nextRound', roundController.makeInfoObject());
    });

    // BUILD
    socket.on('client:build', (data) => {
        buildingController.buildBuilding(data.buildingId, data.placeId);

        socket.emit('server:build');
        socket.emit('server:provideBuildings', user.building);
    });

})


server.listen(process.env.PORT, () =>
    console.log(`server listen on ${process.env.PORT} | ${process.env.NODE_ENV} SERVER`)
);


process.on('uncaughtException', (err) => {
    writeLog(err);
    console.log(err);
    process.exit(1);
});
