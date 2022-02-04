import Notification from "../models/Notification";
import {Socket} from "socket.io";

class NotificationService{
    private socket: Socket;

    constructor(socket: Socket) {
        this.socket = socket;
    }

    public sendNotification(title: string, description: string): void {
        const notification: Notification = { title, description };

        this.socket.emit('server:notification', notification);
    }
}

export default NotificationService;
