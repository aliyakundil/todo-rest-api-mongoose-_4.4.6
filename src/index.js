"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var app = (0, express_1.default)();
var nextId = 1;
var Priority;
(function (Priority) {
  Priority["Low"] = "low";
  Priority["Medium"] = "medium";
  Priority["High"] = "high";
})(Priority || (Priority = {}));
var todos = [
  {
    id: nextId++,
    text: "Learn TypeScript",
    completed: "false",
    priority: Priority.High,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: nextId++,
    text: "Build API",
    completed: "true",
    priority: Priority.Medium,
    createdAt: new Date("2024-01-02"),
  },
  {
    id: nextId++,
    text: "Write tests",
    completed: "false",
    priority: Priority.Low,
    createdAt: new Date("2024-01-03"),
  },
];
function getTodos(options) {
  // Конвертируем page и limit в числа
  var page = options.page ? parseInt(options.page) : 1;
  var limit = options.limit ? parseInt(options.limit) : 10;
  // Фильтруем по completed, priority и search
  var filtered = todos.filter(function (todo) {
    if (options.completed !== undefined) {
      if (todo.completed !== options.completed) return false;
    }
    if (options.priority) {
      if (todo.priority !== options.priority) return false;
    }
    if (options.search) {
      if (!todo.text.toLowerCase().includes(options.search.toLowerCase()))
        return false;
    }
    return true;
  });
  // Пагинация
  var total = filtered.length;
  var totalPages = Math.ceil(total / limit);
  var start = (page - 1) * limit;
  var paginatedTodos = filtered.slice(start, start + limit);
  // Возвращаем todos и мета
  return {
    todos: paginatedTodos,
    meta: {
      total: total,
      page: page,
      limit: limit,
      totalPages: totalPages,
    },
  };
}
// Пример вызова
// console.log(getTodos({ page: "1", limit: "2", completed: "true", priority: "medium", search: "API" }));
console.log(
  getTodos({
    page: "1",
    limit: "10",
    completed: "true",
    priority: Priority.Medium,
    search: "API",
  }),
);
