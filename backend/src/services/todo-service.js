const Todo = require('../model/todo');
const Joi = require('joi');

async function addTodo({ userId, title, taskDesc }) {
    try {
        validateTodoData({ userId, title, taskDesc });
        const newTodo = new Todo({ userId, title, taskDesc });
        await newTodo.save();
        return newTodo;
    } catch (error) {
        console.error('Error adding todo:', error.message);
        throw new Error('Error adding todo: ' + error.message);
    }
}

function validateTodoData({ userId, title, taskDesc }) {
    const todoSchema = Joi.object({
        userId: Joi.object().required(),
        title: Joi.string().min(1).required(),
        taskDesc: Joi.string().allow('').optional(),
    });

    const { error } = todoSchema.validate({ userId, title, taskDesc });
    if (error) {
        throw new Error(error.details[0].message);
    }
}

async function getTodosByUserId({ userId, completed, page = 1, pageSize = 10 }) {
    try {
        validateGetTodosData({ userId, completed, page, pageSize });
        const query = { userId, isDeleted: false };

        if (completed !== undefined) {
            query.checked = completed;
        }

        return await Todo.find(query)
            .skip((page - 1) * pageSize)
            .limit(pageSize);
    } catch (error) {
        console.error('Error retrieving todos:', error.message);
        throw new Error('Error retrieving todos: ' + error.message);
    }
}

function validateGetTodosData({ userId, completed, page, pageSize }) {
    const schema = Joi.object({
        userId: Joi.object().required(),
        completed: Joi.boolean().optional(),
        page: Joi.number().integer().min(1).optional(),
        pageSize: Joi.number().integer().min(1).optional(),
    });

    const { error } = schema.validate({ userId, completed, page, pageSize });
    if (error) {
        throw new Error(error.details[0].message);
    }
}

async function deleteTodo(todoId) {
    try {
        return await Todo.findByIdAndUpdate(todoId, { isDeleted: true }, { new: true });
    } catch (error) {
        console.error('Error deleting todo:', error.message);
        throw new Error('Error deleting todo: ' + error.message);
    }
}

async function updateTodo(todo) {
    try {
        //validateTodoData(todo)
        return await Todo.findByIdAndUpdate(todo._id, todo, { new: true });
    } catch (error) {
        console.error('Error updating todo:', error.message);
        throw new Error('Error updating todo: ' + error.message);
    }
    function validateTodoData(todo) {
        const schema = Joi.object({
            title: Joi.string().min(1).required()
        });
    
        const { error } = schema.validate(todo);
        if (error) {
            throw new Error(error.details[0].message);
        }
    }
    
}

async function getTodoCounts(userId) {
    try {
        const completedCount = await Todo.countDocuments({ userId, isDeleted: false, checked: true });
        const remainingCount = await Todo.countDocuments({ userId, isDeleted: false, checked: false });

        return {
            completedCount,
            remainingCount,
        };
    } catch (error) {
        console.error('Error retrieving todo counts:', error.message);
        throw new Error('Failed to get todo counts');
    }
}

const todoService = {
    addTodo,
    getTodosByUserId,
    deleteTodo,
    updateTodo,
    getTodoCounts,
};

module.exports = Object.freeze(todoService);
