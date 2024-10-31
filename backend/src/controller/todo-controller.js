const { successResponse, errorResponse } = require('../utils/response');
const todoService = require('../services/todo-service');

const createTodo = async (req, res) => {
    try {
        const { title, taskDesc } = req.body;
        const { userId } = req;
        const todo = await todoService.addTodo({ userId, title, taskDesc });
        res.status(201).send(successResponse(todo));
    } catch (e) {
        console.log(e.message);
        res.status(400).json(errorResponse('Error creating todo', e.message));
    }
};

const getUserTodos = async (req, res) => {
    try {
        const { userId } = req;
        const { completed, page, pageSize } = req.query;
        const todos = await todoService.getTodosByUserId({ userId, completed, page, pageSize });
        res.status(200).send(successResponse(todos));
    } catch (e) {
        console.log(e.message);
        res.status(400).json(errorResponse('Error retrieving todos', e.message));
    }
};

const deleteTodo = async (req, res) => {
    try {
        const todoId = req.params.todoId;
        const deletedTodo = await todoService.deleteTodo(todoId);
        res.status(200).send(successResponse(deletedTodo));
    } catch (e) {
        console.log(e.message);
        res.status(400).json(errorResponse('Error deleting todo', e.message));
    }
};

const updateTodo = async (req, res) => {
    try {
        const todo = req.body;
        const updatedTodo = await todoService.updateTodo(todo);
        res.status(200).send(successResponse(updatedTodo));
    } catch (e) {
        console.log(e.message);
        res.status(400).json(errorResponse('Error updating todo', e.message));
    }
};

module.exports = Object.freeze({
    createTodo,
    getUserTodos,
    deleteTodo,
    updateTodo,
});
