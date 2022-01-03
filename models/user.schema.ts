import {Schema, model, Model} from 'mongoose';
import bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';

const userSchema = new Schema({
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
        unique: [true, 'Email must be unique.'],
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
            validator: function (passwordConfirm: string) {
                // @ts-ignore
                return passwordConfirm === this.password;
            },
            message: 'Password and password confirm must be the same.',
        },
    },
    coins: {
        type: Number,
        min: 0
    },
    building: {
        type: [],
        default: [],
    },
    level: {
        type: Number,
        default: 1,
        min: 1,
        max: 100,
    },
    role: {
        type: String,
        default: 'user',
        enum: ['admin', 'user', 'moderator'],
    },
    money: {
        type: Number,
        default: 50000,
    },
    exp: {
        type: Number,
        default: 0,
    },
    isActivated: {
        type: Boolean,
        default: true,
    },
    photo: String,
    isEmailActivated: {
        type: Boolean,
        default: false,
    },
    twoAuth: {
        type: Boolean,
        default: false,
    },
    isPrivateAccount: { type: Boolean, default: false, },
    passwordResetToken: String,
    passwordResetExpiresIn: Date,
    passwordChangedAt: Date,
    activateEmailToken: String,
    activateEmailTokenExpiresIn: Date,
    twoAuthLoginToken: Number,
    twoAuthLoginExpiresIn: Date,
});

userSchema.pre('save', async function (next: Function) {
    console.log(this.password);
    if (!this.isModified('password') || this.isNew) {
        return next();
    }

    if (this.isNew) {
        this.password = await bcrypt.hash(this.password, 12);
    }

    // this.password = bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    
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

const UserSchema: Model<any> = model('User', userSchema, 'Users');

export default UserSchema;
