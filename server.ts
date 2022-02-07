import app from './app';
import writeLog from './utils/writeLog';
import { Server, Socket } from 'socket.io';
import http from 'http';
import { promisify } from "util";
import jwt from 'jsonwebtoken';
import UserModel from "./models/UserModel";
import User from "./models/User";
import RoundController from "./controllers/RoundController";
import { BuildingController } from './controllers/BuildingController';
import Building from "./models/BuildingModel";
import Quest from "./models/Quest";
import NotificationService from "./services/NotificationService";
import { tilemap, tileTypes } from "./map/tilemap";
import Notification from "./models/Notification";

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
    const user: any = await UserModel.findById(userId);
    user.isActive = true;
    await user.save({ validateBeforeSave: false });

    const roundController: RoundController = new RoundController(user);
    const buildingController: BuildingController = new BuildingController(user);
    const notificationService: NotificationService = new NotificationService(socket);

    // ON CONNECTION
    socket.emit('server:nextRound', { info: roundController.makeInfoObject() })
    socket.emit('server:buildingList', await Building.find({}));
    socket.emit('server:provideBuildings', user.building);
    socket.emit('server:tileMap', { tilemap, tileTypes });

    // ON DISCONNECT
    socket.on('disconnect', async () => {
       user.isActive = false;
       await user.save({ validateBeforeSave: false });
    });

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

    // FRIENDS
    const emitInvitations = (invitations: Array<User>) => socket.emit('server:getInvitations', { invitations });

    socket.on('client:getFriends', async () => {
        let friends: Array<User>;

        if (user.friends.length > 0) {
            await user.populate('friends');
        }

        friends = user.friends;

        socket.emit('server:getFriends', { friends });
    });

    socket.on('client:searchFriends', async ({ token }) => {
        const isFriendCode: boolean = token.match(/[0-9]/g)?.length === 4;
        let users: Array<User>;

        if (!isFriendCode) {
            const pattern: RegExp = new RegExp(token, 'g')

            users = await UserModel.find({
                username: { $regex: pattern },
                _id: { $ne: user._id }
            }).select('_id username');

        } else {
            users = await UserModel.find({
                friendCode: parseInt(token),
                _id: { $ne: user._id }
            }).select('_id username');
        }

        socket.emit('server:searchFriends', { users });
    });

    socket.on('client:addFriend', async (id) => {
        const friend: User | null = await UserModel.findById(id);

        if (!friend) {
            return;
        }

        if (friend.invitations.includes(user._id)) {
            return;
        }

        const notification: Notification = {
            title: `Invitation`,
            description: `${user.username} invite You to friends.`
        };

        friend.invitations.push(user._id);
        friend.notifications.push(notification);

        await friend.save({ validateBeforeSave: false });

        emitInvitations(user.invitations);
    });

    socket.on('client:getInvitations', async () => {
        await user.populate('invitations');

        socket.emit('server:getInvitations', { invitations: user.invitations })
    });

    socket.on('client:acceptInvitation', async (id) => {
        console.log(user.invitations[0]._id.toString())
        const newFriend: User = user.invitations?.find((invitation: User) => invitation?._id.toString() === id);

        user.invitations = user.invitations.filter(
            (invitation: User) => invitation._id === id
        );

        user.friends.push(newFriend._id);
        newFriend.friends.push(user._id);

        await newFriend.save({ validateBeforeSave: false });
        await user.save({ validateBeforeSave: false });

        emitInvitations(user.invitations);
    });

    socket.on('client:rejectInvitation', async (id) => {
        user.invitations = user.invitations.filter(
            (invitation: User) => invitation._id === id
        );

        await user.save({ validateBeforeSave: false });

        emitInvitations(user.invitations);
    });

    socket.on('client:getFriendCode', () => {
       socket.emit('server:getFriendCode', { code: user.friendCode });
    });

    socket.on('client:generateNewFriendCode', async() => {
        if (user.isCanGenerateNewFriendCode()) {
            user.friendCode = user.generateFriendCode();
            await user.save({ validateBeforeSave: false })
                .then(() => {
                    socket.emit('server:getFriendCode', { code: user.friendCode });
                });
        }
    });

    socket.on('client:getTopPlayers', async () => {
        const topPlayers: Array<User> = await UserModel.find({  })
            .select('-_id username level money building')
            .sort({ level: -1, money: -1 });

        socket.emit('server:getTopPlayers', { topPlayers });
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
