import { model, Schema } from 'mongoose';

const buildingSchema = new Schema({
    name: String,
    img: { type: String, default: '' },
    cost: { type: Number, default: 100, },
    coinsPerDay: { type: Number, default: 100, },
    expPerDay: { type: Number, default: 100 },
    expensePerPerson: { type: Number, default: 40, },
    coinsPerPerson: { type: Number, default: 50 },
    level: { type: Number, min: 1, max: 100, default: 1, },
    requiredLevel: { type: Number, default: 1, min: 1, max: 100,},
    forPeople: { type: Number, default: 5, },
    people: { type: Number, default: 0, },
    usedEnergy: { type: Number, default: 0, min: 0, },
    producedEnergy: { type: Number, default: 0, min: 0,},
    placeId: { type: Number },
    super: {},
});

buildingSchema.pre('save', (next) => {
    // @ts-ignore
    this.coinsPerDay = (this.coinsPerPerson * this.people);
    next();
});

const buildingModel = model('Building', buildingSchema);

export default buildingModel;
