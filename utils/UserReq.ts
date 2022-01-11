import { Request } from "express";

export default interface UserReq extends Request{
    user: any,
}
