import Task from "./Task";

export interface Quest {
    _id?: string;
    __v?: string;

    name: string;
    award: number;
    description: string;

    isComplete: boolean;
    requirement: Task[];
}
