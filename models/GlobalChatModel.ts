import GlobalChat from "./GlobalChat";
import {model, Schema, Model} from "mongoose";

const globalChatSchema = new Schema<GlobalChat>({

});

const globalChatModel = model('GlobalChat', globalChatSchema);

export default globalChatModel;
