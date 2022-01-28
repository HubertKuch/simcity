export default interface Task {
    _id?: string;
    __v?: string;

    name: string;
    type: string;
    requirements: [];
    isComplete: boolean;
}