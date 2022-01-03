import { Request, Response, NextFunction } from 'express';

export default (callback: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        callback(req, res, next).catch(next);
    }
}
