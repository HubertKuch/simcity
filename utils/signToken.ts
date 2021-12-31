import { sign } from 'jsonwebtoken';
import { Response } from 'express';

export default async function signToken (res: Response, id: string): Promise<string> {
    console.log(process.env.JWT_COOKIE_EXPIRES!);
    
    const token: string = sign({id}, process.env.JWT_SECRET!, {expiresIn: process.env.JWT_EXPIRES!})

    res.cookie('token', token, {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES!),
    });

    return token;
};