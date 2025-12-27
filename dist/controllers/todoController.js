import * as todoService from '../services/todoService';
export function getTodos(req, res) {
    const result = todoService.getTodos(req.query);
    res.json({
        success: true,
        data: {
            todos: result.todo,
            meta: result.meta
        }
    });
}
export function getTodoById(req, res) {
    const id = Number(req.params.id);
    const todo = todoService.getTodoById(id);
    if (!todo) {
        return res.status(404).json({
            success: false,
            error: 'Todo not found'
        });
    }
    res.json({
        success: true,
        data: todo
    });
}
export function createTodo(req, res) {
    const todo = todoService.createTodo(req.body);
    res.status(201).json({
        success: true,
        data: todo
    });
}
export function updateTodo(req, res) {
    const id = Number(req.params.id);
    const updated = todoService.updateTodo(id, req.body);
    if (!updated) {
        return res.status(404).json({
            success: false,
            error: 'Todo not found'
        });
    }
    res.json({
        success: true,
        data: updated
    });
}
export function patchTodo(req, res) {
    const id = Number(req.params.id);
    const updated = todoService.updateTodo(id, req.body);
    if (!updated) {
        return res.status(404).json({
            success: false,
            error: 'Todo not found'
        });
    }
    res.json({
        success: true,
        data: updated
    });
}
export function deleteTodo(req, res) {
    const id = Number(req.params.id);
    const deleted = todoService.deleteTodo(id);
    if (!deleted) {
        return res.status(404).json({
            success: false,
            error: 'Todo not found'
        });
    }
    res.json({
        success: true,
        data: null
    });
}
export function getStats(_req, res) {
    const stats = todoService.getStats();
    res.json({
        success: true,
        data: stats
    });
}
