import Building from "./Building";
import { Document, Schema } from "mongoose";
import Quest from "./Quest";
import Notification from "./Notification";

export default interface User extends Document{
    readonly _id: string;
    readonly __v: string;
    
    username: string;
    email: string;
    password: string;
    passwordConfirm?: string;
    photo?: string;
    friendCode: number;
    isActive: boolean;

    building: Array<Building>;
    quests: Array<Quest>;
    friends: Array<Schema.Types.ObjectId>;
    invitations: Array<Schema.Types.ObjectId>;
    notifications: Array<Notification>;

    level: number;
    role: string;
    money: number;
    exp: number;

    isActivated: boolean;
    twoAuth: boolean;
    isEmailActivated: boolean;
    activateEmailToken?: string;
    isProtectedAccount?: string;
    activateEmailTokenExpiresIn?: Date|number;
    passwordChangedAt?: Date|number;
    twoAuthLoginToken?: number|string|undefined;
    twoAuthLoginExpiresIn?: Date|number|undefined;
    passwordResetToken?: string;
    passwordResetExpiresIn?: Date|number;
    lastGenerateFriendCode?: Date|number;

    generateTwoAuthToken(): string;
    comparePassword(token: string): boolean;
    generateFriendCode(): number;
}