import Building from "./Building";
import { Document } from "mongoose";

export default interface User extends Document{
    _id: string;
    username: string;
    email: string;
    password: string;
    passwordConfirm?: string;
    photo?: string;

    building: Array<Building>;
    level: number;
    role: string;
    money: number;
    exp: number;

    isActivated: boolean;
    twoAuth: boolean;
    isEmailActivated: boolean;
    activateEmailToken?: string;
    isprotectedAccount?: string;
    activateEmailTokenExpiresIn?: Date| number;
    passwordChangedAt?: Date|number;
    twoAuthLoginToken?: number|string|undefined;
    twoAuthLoginExpiresIn: Date|number|undefined;
    passwordResetToken: string;
    passwordResetExpiresIn: Date|number;

    generateTwoAuthToken(): string;
    comparePassword(token: string): boolean;
}