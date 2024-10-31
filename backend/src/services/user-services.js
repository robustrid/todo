const User = require('../model/user');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const CryptoJS = require('crypto-js');
const tokenServices = require('./token-service');
const todoService = require('./todo-service');

const SECRET_KEY = process.env.PASSWORD_SECRET_KEY;

function validateUserData({ name, email, password }) {
    const userSchema = Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    });

    const { error } = userSchema.validate({ name, email, password });
    if (error) {
        throw new Error(error.details[0].message);
    }
}

async function createUser({ name, email, password }) {
    try {
        validateUserData({ name, email, password });

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('Email already exists.');
        }

        const encryptedPassword = CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
        const newUser = new User({ name, email, password: encryptedPassword });
        await newUser.save();

        return newUser;
    } catch (error) {
        console.error(error.message);
        throw new Error(error.message);
    }
}

async function loginUser({ email, password }) {
    try {
        validateLoginData({ email, password });
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found.');
        }

        const bytes = CryptoJS.AES.decrypt(user.password, SECRET_KEY);
        const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

        if (decryptedPassword !== password) {
            throw new Error('Invalid password.');
        }

        const tokenData = await tokenServices.createToken(user._id);
        return { token: tokenData.token };
    } catch (error) {
        console.error(error.message);
        throw new Error(error.message);
    }

    function validateLoginData({ email, password }) {
        const loginSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
        });

        const { error } = loginSchema.validate({ email, password });
        if (error) {
            throw new Error(error.details[0].message);
        }
    }
}

async function getUserDetails({ token }) {
    try {
        const { userId } = await tokenServices.checkToken(token);
        const user = await User.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        const { completedCount, remainingCount } = await todoService.getTodoCounts(user._id);
        return { name: user.name, completedCount, remainingCount };
    } catch (error) {
        console.error('Error retrieving user details:', error.message);
        throw new Error('Failed to get user details: ' + error.message);
    }
}

const userServices = {
    createUser,
    loginUser,
    getUserDetails,
};

module.exports = Object.freeze(userServices);
