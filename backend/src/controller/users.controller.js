const User = require('../model/user');
const { successResponse, errorResponse } = require('../utils/response');
const userServices = require('../services/user-services');

const createUser = async (req, res) => {
    try {
        const response = await userServices.createUser({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        res.status(200).send(successResponse(response));
    } catch (e) {
        console.log(e.message);
        res.status(400).json(errorResponse('User creation failed', e.message));
    }
};

const loginUser = async (req, res) => {
    try {
        const response = await userServices.loginUser({
            email: req.body.email,
            password: req.body.password,
        });
        res.status(200).send(successResponse(response));
    } catch (e) {
        console.log(e.message);
        res.status(400).json(errorResponse('Login failed', e.message));
    }
};

const getUserFromToken = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json(errorResponse('Unauthorized', 'No token provided'));
        }

        const token = authHeader.split(' ')[1];
        const userResponse = await userServices.getUserDetails({ token });
        res.status(200).send(successResponse(userResponse));
    } catch (e) {
        console.log(e.message);
        res.status(400).json(errorResponse('Failed to get user', e.message));
    }
};

module.exports = Object.freeze({
    createUser,
    loginUser,
    getUserFromToken,
});
