import Quest from "../models/Quest";
import adminQuestService from "../services/AdminQuestService";
import sendStatus from "../utils/sendStatus";
import {NextFunction, Request, Response} from "express";
import AppError from "../utils/appError";

class QuestController {
    public async getAllQuests(req: Request, res: Response, next: NextFunction): Promise<void> {
        const quests: Array<Quest> = await adminQuestService.getAllQuests();

        sendStatus(res, 'ok', 200, 'ok', { quests });
    }

    public async addNewQuest(req: Request, res: Response, next: NextFunction): Promise<void> {
        const data: Quest = req.body;

        try{
            await adminQuestService.addNewQuest(data);
        } catch (e) {
            new AppError('ERROR', 401);
        }
    }
}

export default QuestController;
