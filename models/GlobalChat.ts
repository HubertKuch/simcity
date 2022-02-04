import Message from "./Message";
import {Document} from "mongoose";

export default interface GlobalChat extends Document {
    _id?: string;

    messages: Array<Message>;
}
