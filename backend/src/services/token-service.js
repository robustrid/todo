const Token = require('../model/tokens');
const crypto = require('crypto');

const SECRET_KEY = process.env.PASSWORD_SECRET_KEY;

async function createToken(userId) {
    try {
        const token = generateToken();
        const newToken = new Token({ token, userId });
        await newToken.save();
        return newToken;
    } catch (error) {
        console.error(error.message);
        throw new Error('Error creating token: ' + error.message);
    }
}

function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

async function checkToken(token) {
    try {
        const foundToken = await Token.findOne({ token });
        if (!foundToken) {
            throw new Error('Token not found or does not belong to this user.');
        }
        return foundToken;
    } catch (error) {
        console.error(error.message);
        throw new Error('Error checking token: ' + error.message);
    }
}

async function deleteTokenByUserId(userId) {
    try {
        const result = await Token.deleteMany({ userId });
        return result.deletedCount;
    } catch (error) {
        console.error(error.message);
        throw new Error('Error deleting tokens: ' + error.message);
    }
}

const tokenServices = {
    createToken,
    checkToken,
    deleteTokenByUserId,
};

module.exports = Object.freeze(tokenServices);
