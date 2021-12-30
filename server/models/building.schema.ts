import {model, Schema, Model } from 'mongoose';

const buildingSchema = new Schema({
    name: String,
    cost: {
        type: Number,
        default: 100,
    },
    coinsPerDay: {
        type: Number,
        default: 100,
    },
    coinsPerPerson: { type: Number, default: 50 },
    level: {
        type: Number,
        min: 1,
        max: 100,
        default: 1,
    },
    requiredLevel: {
        type: Number,
        default: 1,
        min: 1,
        max: 100,
    },
    forPeople: {
        type: Number,
        default: 5,
    },
    people: {
        type: Number,
        default: 0,
    },
    placeId: { type: Number },
    powerPerDay: {},
    expPerDay: {},
    super: {},
});

buildingSchema.pre('save', (next) => {
    // @ts-ignore
    this.coinsPerDay = (this.coinsPerPerson * this.people);
    next();
});

const buildingModel: Model<any> = model('Building', buildingSchema);

export default buildingModel;
