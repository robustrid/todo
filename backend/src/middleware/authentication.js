const tokenServices = require('../services/token-service');
const { errorResponse } = require('../utils/response');

const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json(errorResponse('Authentication failed', 'No token provided.'));
        }

        const foundToken = await tokenServices.checkToken(token);
        if (!foundToken) {
            return res.status(401).json(errorResponse('Authentication failed', 'Invalid token.'));
        }

        req.userId = foundToken.userId;
        next();
    } catch (error) {
        console.error('Authentication error:', error.message);
        res.status(500).json(errorResponse('Authentication error', error.message));
    }
};

module.exports = Object.freeze({
    authenticate,
});
