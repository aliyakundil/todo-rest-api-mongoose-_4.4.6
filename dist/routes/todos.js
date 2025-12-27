import { Router } from 'express';
import * as todoController from '../controllers/todoController.js';
import { validateAndHandle, validateCreateTodo, validateUpdateTodo, validateTodoId, validateTodoQuery } from '../middleware/validation.js';
const router = Router();
// GET /api/todos - Получение всех (пагинация + фильтры)
router.get('/', validateAndHandle([validateTodoQuery]), todoController.getTodos);
// GET /api/todos/stats - Статистика (ВАЖНО: выше чем /:id)
router.get('/stats', todoController.getStats);
// GET /api/todos/:id - Получение по ID
router.get('/:id', validateAndHandle([validateTodoId]), todoController.getTodoById);
// POST /api/todos - Создание
router.post('/', validateAndHandle([validateCreateTodo]), todoController.createTodo);
// PUT /api/todos/:id - Полное обновление
router.put('/:id', validateAndHandle([validateTodoId, validateUpdateTodo]), todoController.updateTodo);
// PATCH /api/todos/:id - Частичное обновление
router.patch('/:id', validateAndHandle([validateTodoId, validateUpdateTodo]), todoController.patchTodo);
// DELETE /api/todos/:id - Удаление
router.delete('/:id', validateAndHandle([validateTodoId]), todoController.deleteTodo);
export default router;
