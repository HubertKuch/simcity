export default interface Building {
    readonly _id?: string;
    readonly __v?: string;

    name: string;
    cost: number;
    coinsPerDay: number;
    expPerDay:number;
    expensePerPerson:number;
    coinsPerPerson: number;
    level: number;
    requiredLevel: number;
    forPeople: number;
    people: number;
    usedEnergy: number;
    producedEnergy: number;
    img: string;
}