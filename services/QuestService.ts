import User from "../models/User";
import Quest from "../models/Quest";

class QuestService {
    private user: User;

    constructor(user: User) {
        this.user = user;
    }

    public getQuest(): Array<Quest> {
        return this.user.quests;
    }
}

export default QuestService;
