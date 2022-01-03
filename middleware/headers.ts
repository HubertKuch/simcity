import { Response, Request, NextFunction } from 'express';

export default (req: Request, res: Response, next: NextFunction) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src *; font-src *;"
      );

    next();
}
