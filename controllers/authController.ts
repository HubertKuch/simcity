import { Response, Request, NextFunction } from 'express';
import UserModel from "../models/UserModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import sendStatus from "../utils/sendStatus";
import sendEmail from "../utils/sendEmail";
import jwt from 'jsonwebtoken';
import signToken from '../utils/signToken';
import UserReq from '../utils/UserReq';
import { createHash } from 'crypto';
import { promisify } from 'util';
import User from "../models/User";

interface SignUpData {
    username: string,
    password: string,
    passwordConfirm: string,
    email: string,
    photo?: string,
}

const makeVerificationEmailURL = (activationToken: string, userId: string, req: Request): string => {
    return `${req.protocol}://${req.hostname}${req.baseUrl}/verifyEmail/${userId}/${activationToken}`;
}

const makeHashedVerificationToken = (verToken: string): string => createHash('sha256').update(verToken).digest('hex');

const validateVerifyEmail = async (
    hashedVerificationToken: string, 
    user: any,
    res: Response,
    ) => {
    if (hashedVerificationToken === user.activateEmailToken && (user.activateEmailTokenExpiresIn > Date.now()-5)){
        user.isEmailActivated = true;
        user.activateEmailToken = undefined;
        user.activateEmailTokenExpiresIn = undefined;
        await user.save({ validateBeforeSave: false });

        return sendStatus(res, 'Your account was activated.' ,200, 'ok', { user });
    }
}

const validateLoginData = ({ email, password }: { email: string, password: string }, next: NextFunction) => {
    if (!email || !password) {
        return next(new AppError('Please provide email and password.', 400));
    }
}

const checkRestrictedRoles = (roles: Array<string>, userRole: string, next: NextFunction) => {
    if (!roles.includes(userRole)) {
        next(new AppError('You don\'t permission to perform this action.', 403));
    }
}


const signup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { username, passwordConfirm, password, photo, email }: SignUpData = req.body;

    if (!username || !email || !password || !passwordConfirm)
        return next(new AppError('Please provide all of your data and try again.', 400));

    const user: User = new UserModel({ email, username, password, passwordConfirm, photo, });

    const verifyEmailURL = makeVerificationEmailURL(user.generateTwoAuthToken(), user._id, req);

    await sendEmail({
        message: `Verify your email at ${verifyEmailURL}`,
        subject: 'Verify email',
        to: 'kuchhhubert@gmail.com'
    });

    const token: string = await signToken(res, user._id);

    await user.save();

    sendStatus(res, 'success', 201, 'ok', { token });
});

const verifyEmail = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id, token } = req.params;

    if (!id || !token) return sendStatus(res, 'Something went wrong. Open link again and check.', 400, 'fail');

    const user = await UserModel.findById(id);
    const hashedVerificationToken = makeHashedVerificationToken(token);

    if (!user) {
        return next(new AppError('Invalid user id.', 401));
    }

    await validateVerifyEmail(hashedVerificationToken, user, res);
});

const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password }: { email: string, password: string } = req.body;

    validateLoginData({ email, password }, next);

    const user: User|null = await UserModel.findOne({ email }).select('+password');

    if (!await user) {
        return next(new AppError('Email or password was incorrect.', 401));
    }

    // compare hash
    if (!(await user?.comparePassword(password))) {
        return next(new AppError('Email or password was incorrect.', 401));
    }

    // check if email is active
    if (!user?.isEmailActivated) {
        return next(new AppError('Your email was not activated', 401));
    }

    // check if user account was not deleted
    if (!user.isActivated) {
        return next(new AppError('Your account was deleted', 401));
    }

    if (user.twoAuth) {
        let loginToken: string = await user.generateTwoAuthToken();

        await user.save({ validateBeforeSave: false });
        await sendEmail({
            message: `Your activation code is here ${loginToken}`,
            subject: 'Activation code',
            to: 'kuchhhubert@gmail.com'
        });

        return sendStatus(res,
            'On your account was activated two factor authentication.' +
            'You must provide six numbers sent to your email.',
            200,
            'ok'
        );
    }

    const token: string = await signToken(res, user?._id ?? '');

    sendStatus(res, 'success', 200, 'ok', { token });
});

const restrictTo = function (restrictedRoles: string) {
    const roles: Array<string> = restrictedRoles.split(' ');

    return (req: Request, res: Response, next: NextFunction) => {
        // @ts-ignore
        checkRestrictedRoles(roles, req.user.role, next);
        next();
    }
};

const protectRoute = catchAsync(async (req: UserReq, res: Response, next: NextFunction) => {
    let token: string = '';

    if (req.headers.authorization && `${req.headers.authorization}`.startsWith('Bearer')) {
        token! = req.headers.authorization?.split(' ')[1];
    }
    
    if (token === '') {
        return next(new AppError('The token was not sent correct or you are not logged in.', 400));
    }

    // @ts-ignore
    const decodedData: { id: string } = await promisify(jwt.verify)(token, process.env.JWT_SECRET!);

    // Check if user with this id still exists
    const user = await UserModel.findById(decodedData.id);

    if (!user) {
        return next(new AppError('UserModel with this id does not exists. Log in again.', 401));
    }

    // check if user was changed password after token was created
    // @ts-ignore
    if (user.afterPasswordChanged(decodedData.iat)) {
        return next(new AppError('Password was changed after login. Please login again.', 401));
    }

    // @ts-ignore
    req.user = user;
    next();
});

const twoFactorAuth = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id, token }= req.params;

    if (!id || !token || token.length < 6) {
        return sendStatus(res, 'Provide activation code from your email.', 400, 'fail');
    }

    const user: User|null = await UserModel.findById(id);

    if (!user) {
        return new AppError('Please log in', 401);
    }

    if (user.twoAuthLoginToken !== token && (user?.twoAuthLoginExpiresIn ?? 0) < Date.now() - 500) {
        return sendStatus(res, 'Your activation code was wrong or has expired.', 401, 'fail');
    }

    user.twoAuthLoginExpiresIn = undefined;
    user.twoAuthLoginToken = undefined;

    await user.save({ validateBeforeSave: false });

    const jwtToken: string = await signToken(res, user._id);

    return sendStatus(res, 'Success', 200, 'ok', { jwtToken });
});

const isLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
    const jwtCookie: string = req.cookies.token;
    
    if (!jwtCookie) {
        return res.redirect('/login')
    }
    
    try {
        jwt.verify(jwtCookie, process.env.JWT_SECRET!, async (err, decodedData) => {
            if (err) {                
                return res.redirect('/login');
            }
    
            const user = await UserModel.findById(decodedData?.id!);

            if (!user) {
                return next();
            }

            res.locals.user = user;
            next();
        });
    } catch (err) {
        return next();
    }
}

const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let jwtCookie: string = req.cookies.token;
    
    if(!jwtCookie) {
        return res.status(400).json({ message: 'INVALID_SENT_TOKEN_VIA_COOKIE', status: 'error', statusCode: 400});
    }   
    
    res.clearCookie('token');
    return res.status(200).json({ message: 'sucesss', status: 'ok', statusCode: 200, data: { token: jwtCookie }});
})

export default { signup, verifyEmail, login, protectRoute, restrictTo, twoFactorAuth, isLoggedIn, logout };
