import { Schema } from 'mongoose';

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
});

export default buildingSchema;
