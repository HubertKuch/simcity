import { Document } from "mongoose";

export default interface Quest extends Document {
    readonly _id?: string;
    readonly __v?: string;

    id: string;
    name: string;
    moneyAward: number;
    expAward: number;
    description: string;

    isComplete: boolean;
    requirement: string;
}
