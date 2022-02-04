import Building from "./Building";
import { Document } from "mongoose";
import Quest from "./Quest";

export default interface User extends Document{
    readonly _id: string;
    readonly __v: string;
    
    username: string;
    email: string;
    password: string;
    passwordConfirm?: string;
    photo?: string;

    building: Array<Building>;
    quests: Array<Quest>;
    level: number;
    role: string;
    money: number;
    exp: number;

    isActivated: boolean;
    twoAuth: boolean;
    isEmailActivated: boolean;
    activateEmailToken?: string;
    isprotectedAccount?: string;
    activateEmailTokenExpiresIn?: Date|number;
    passwordChangedAt?: Date|number;
    twoAuthLoginToken?: number|string|undefined;
    twoAuthLoginExpiresIn?: Date|number|undefined;
    passwordResetToken?: string;
    passwordResetExpiresIn?: Date|number;

    generateTwoAuthToken(): string;
    comparePassword(token: string): boolean;
}