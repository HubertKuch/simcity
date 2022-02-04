import Quest from "./Quest";
import { model, Schema } from 'mongoose';
import UserModel from "./UserModel";

const questSchema = new Schema<Quest>({
    name: { type: String, default: 'BAD_QUEST_NAME' },
    moneyAward: { type: Number, default: 0 },
    expAward: { type: Number, default: 0 },
    description: { type: String, default: 'BAD_QUEST_DESCRIPTION' },
    isComplete: { type: Boolean, default: false },
    requirement: { type: String }
});

questSchema.pre('save', async function(next: Function) {
    const copy: Quest = JSON.parse(JSON.stringify(this.toObject()));
    // @ts-ignore

    await UserModel.updateMany(
        {},
        {
            $push: {
                quests: copy,
            },
        },
    );

    next();
});

const QuestModel = model('quest', questSchema);

export default QuestModel;
