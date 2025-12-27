export let nextId = 1;
export let todos = [
    {
        id: nextId++,
        text: "Learn TypeScript",
        completed: false,
        priority: 'high',
        createdAt: new Date("2024-01-01")
    },
    {
        id: nextId++,
        text: "Build API",
        completed: true,
        priority: 'medium',
        createdAt: new Date("2024-01-02")
    },
    {
        id: nextId++,
        text: "Write tests",
        completed: false,
        priority: 'low',
        createdAt: new Date("2024-01-03")
    }
];
export const getTodosData = () => todos;
export function getTodos(options) {
    const page = options.page ? parseInt(options.page) : 1;
    const limit = options.limit ? parseInt(options.limit) : 10;
    let completedFilter;
    if (options.completed !== undefined) {
        completedFilter = options.completed === 'true';
    }
    let todo = todos.filter(item => {
        if (completedFilter !== undefined)
            if (item.completed !== completedFilter)
                return false;
        if (options.priority !== undefined)
            if (item.priority !== options.priority)
                return false;
        if (options.search) {
            if (!item.text.toLowerCase().includes(options.search.toLowerCase()))
                return false;
        }
        return true;
    });
    return {
        todo,
        meta: {
            total: todo.length,
            page: page,
            limit: limit,
            totalPage: Math.ceil(todo.length / limit)
        }
    };
}
export function getTodoById(id) {
    return todos.find(todo => todo.id === id) ?? null;
}
export function createTodo(input) {
    const newTodo = {
        id: nextId++,
        text: input.text.trim(),
        completed: input.completed === 'true' || input.completed === true,
        priority: input.priority ?? 'low',
        createdAt: new Date()
    };
    todos.push(newTodo);
    return newTodo;
}
export function updateTodo(id, input) {
    const todoUpdate = todos.find(todo => todo.id === id);
    if (!todoUpdate)
        return null;
    if (input.text !== undefined)
        todoUpdate.text = input.text.trim();
    if (input.completed !== undefined)
        todoUpdate.completed =
            typeof input.completed === 'string'
                ? input.completed === 'true'
                : input.completed;
    if (input.priority !== undefined)
        todoUpdate.priority = input.priority;
    todoUpdate.updatedAt = new Date();
    return todoUpdate;
}
export function patchTodo(id, input) {
    const todoUpdate = todos.find(todo => todo.id === id);
    if (!todoUpdate)
        return null;
    if (input.text !== undefined)
        todoUpdate.text = input.text.trim();
    if (input.completed !== undefined)
        todoUpdate.completed =
            typeof input.completed === 'string'
                ? input.completed === 'true'
                : input.completed;
    if (input.priority !== undefined)
        todoUpdate.priority = input.priority;
    todoUpdate.updatedAt = new Date();
    return todoUpdate;
}
export function deleteTodo(id) {
    if (!id)
        return false;
    const todoDelete = todos.findIndex(todo => todo.id === id);
    todos.splice(todoDelete, 1);
    return true;
}
export function getStats() {
    return {
        total: todos.length,
        completed: todos.filter(todo => todo.completed === true).length,
        pending: todos.filter(todo => todo.completed === false).length,
        byPriority: {
            low: todos.filter(todo => todo.priority === 'low').length,
            medium: todos.filter(todo => todo.priority === 'medium').length,
            high: todos.filter(todo => todo.priority === 'high').length,
        }
    };
}
// Пример вызова
createTodo({
    text: "Alia",
    completed: false,
    priority: 'low'
});
console.log(getTodos({ page: "1", limit: "10", completed: "true", priority: 'medium', search: "API" }));
updateTodo(4, { text: "Alia Kundil" });
console.log(getTodoById(4));
deleteTodo(4);
console.log(getTodoById(4));
console.log(getStats());
