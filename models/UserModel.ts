import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import User from "./User";
import QuestModel from "./QuestModel";

const userSchema = new Schema<User>({
    username: {
        type: String,
        minlength: [4, 'Username must have four or more characters.'],
        required: [true, 'Username is required.']
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        validate: {
            validator: function (passedEmail: string) {
                return !!passedEmail.match(/@/);
            },
            message: 'E-mail is incorrect.',
        },
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        minlength: [8, 'Password must have 8 or more characters.'],
        validate: {
            validator: function (passedPassword: string) {
                return !!passedPassword.match(/[A-Z]/g);
            },
            message: 'Password must one or more capital letter.'
        },
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password.'],
        validate: {
            validator: function (passwordConfirm: string): any {
                // @ts-ignore
                return passwordConfirm === this.password;
            },
            message: 'Password and password confirm must be the same.',
        },
    },

    building: { type: [], default: [], },
    quests: { type: [], default: [] },
    friends: { type: [Schema.Types.ObjectId], default: [], ref: 'User' },
    invitations: { type: [Schema.Types.ObjectId], default: [], ref: 'User' },
    notifications: { type: [], default: [] },

    friendCode: { type: Number, default: 0 },
    level: { type: Number, default: 1, min: 1, max: 100, },
    role: { type: String, default: 'user', enum: ['admin', 'user', 'moderator'], },

    money: { type: Number, default: 50000, },
    exp: {type: Number, default: 0, },

    isActivated: { type: Boolean, default: true, },
    photo: String,
    isActive: { type: Boolean, default: false },

    isEmailActivated: { type: Boolean, default: false, },
    twoAuth: { type: Boolean, default: false, },
    isProtectedAccount: { type: Boolean, default: false, },

    passwordResetToken: String,
    passwordResetExpiresIn: Date,
    passwordChangedAt: Date,

    activateEmailToken: String,
    activateEmailTokenExpiresIn: Date,

    twoAuthLoginToken: Number,
    twoAuthLoginExpiresIn: Date,

    lastGenerateFriendCode: Date,
});

userSchema.pre('save', async function (next: Function) {
    this.passwordConfirm = undefined;

    if (this.isNew) {
        this.friendCode = Math.floor(1000 + Math.random() * 9000);
        this.quests = await QuestModel.find({}).select('-_id -__V');
        this.password = await bcrypt.hash(this.password, 12);
    }

    if (!this.isModified('password') || this.isNew) {
        return next();
    }

    this.passwordChangedAt = Date.now() - 500;
    next();
});

userSchema.methods.afterPasswordChanged = function (jwtTimestamp: number) {
    if (this.passwordChangedAt) {
        return this.passwordChangedAt > jwtTimestamp;
    }
    return false;
};

userSchema.methods.generateActivationEmailToken = function () {
    const activationToken = randomBytes(32).toString('hex');
    this.activateEmailToken = createHash('sha256').update(activationToken).digest('hex');
    this.activateEmailTokenExpiresIn = Date.now() + 24 * 60 * 60 * 1000;
    return activationToken;
};

userSchema.methods.generateTwoAuthToken = function () {
    const token: number = Math.floor(Math.random() * (999999 - 100000) + 100000);
    this.twoAuthLoginToken = token;
    this.twoAuthLoginExpiresIn = Date.now() + 24 * 60 * 60 * 1000;
    return token;
}

userSchema.methods.comparePassword = async function (passedPassword: string) {
    return await bcrypt.compare(passedPassword, this.password);
};

userSchema.methods.generateFriendCode = function (): number | bigint {
    this.lastGenerateFriendCode = Date.now();

    return Math.floor(1000 + Math.random() * 9000);
}

userSchema.methods.isCanGenerateNewFriendCode = function(): boolean {
    if (!this.lastGenerateFriendCode) return true;

    return Date.now() - +this.lastGenerateFriendCode > 60 * 60 * 24;
}

const UserSchema = model<User>('User', userSchema, 'Users');

export default UserSchema;
