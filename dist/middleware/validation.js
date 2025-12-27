export function validateCreateTodo(req, res, next) {
    const { text, priority } = req.body;
    const errors = [];
    if (text !== undefined)
        if (!text || typeof text !== 'string')
            errors.push('text is required and must be string');
    if (priority !== undefined)
        if (priority && !['low', 'medium', 'high'].includes(priority))
            errors.push('priority must be low, medium, or high');
    if (errors.length > 0)
        return res.status(400).json({ success: false, error: 'Validation failed', detailes: errors });
    next();
}
export function validateUpdateTodo(req, res, next) {
    const { text, completed, priority } = req.body;
    const errors = [];
    if (text !== undefined)
        if (!text || typeof text !== 'string')
            errors.push('text is required and must be string');
    if (completed !== undefined)
        if (!completed && typeof completed !== 'boolean' && completed !== 'true' && completed !== 'false')
            errors.push('completed is required and must be boolean');
    if (priority !== undefined)
        if (priority && !['low', 'medium', 'high'].includes(priority))
            errors.push('priority must be low, medium, or high');
    if (errors.length > 0)
        return res.status(400).json({ success: false, error: 'Validation failed', detailes: errors });
    next();
}
export function validateTodoId(req, res, next) {
    const { id } = req.body;
    const errors = [];
    if (id !== undefined)
        if (!id || typeof id !== 'number')
            errors.push('id is required and must be number');
    if (errors.length > 0)
        return res.status(400).json({ success: false, error: 'Validation failed', detailes: errors });
    next();
}
export function validateTodoQuery(req, res, next) {
    const { page, limit, completed, priority, search } = req.query;
    const errors = [];
    if (page !== undefined)
        if (isNaN(parseInt(page)) || parseInt(page) <= 0)
            errors.push('страница (page) должна быть целым положительным числом');
    if (limit !== undefined)
        if (isNaN(parseInt(limit)) || parseInt(limit) <= 0 || parseInt(limit) > 100)
            errors.push('лимит (limit) должен быть числом от 1 до 100');
    if (completed !== undefined)
        if (typeof completed !== 'boolean' && completed !== 'true' && completed !== 'false')
            errors.push('параметр completed должен быть "true" или "false"');
    if (priority !== undefined)
        if (priority && !['low', 'medium', 'high'].includes(priority))
            errors.push('приоритет должен быть: low, medium или high');
    if (search !== undefined)
        if (typeof search !== 'string' || search.trim().length === 0)
            errors.push('строка поиска не может быть пустой');
    if (errors.length > 0)
        return res.status(400).json({ success: false, error: 'Validation failed', detailes: errors });
    next();
}
export const validateAndHandle = (validators) => {
    return async (req, res, next) => {
        for (const validator of validators) {
            await new Promise((resolve) => {
                validator(req, res, (err) => {
                    if (err)
                        return next(err);
                    resolve(null);
                });
            });
            if (res.headersSent)
                return;
        }
        next();
    };
};
