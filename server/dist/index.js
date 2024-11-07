"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server/index.ts
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./db"));
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
const app = (0, express_1.default)();
app.use(express_1.default.json()); // for parsing application/json
app.use(express_1.default.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.get("/api", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("GET /api");
    const allTodos = yield db_1.default.todos.findMany({
        orderBy: {
            createdAt: 'asc' // or 'asc' for oldest first
        }
    });
    res.json({ todos: allTodos });
}));
app.post("/todos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("POST /todos");
    const todo = yield db_1.default.todos.create({
        data: {
            title: req.body.title,
        },
    });
    const allTodos = yield db_1.default.todos.findMany({
        orderBy: {
            createdAt: 'asc' // or 'asc' for oldest first
        }
    });
    res.json({ todos: allTodos });
}));
app.post("/todos/:id/completions", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const todoId = parseInt(req.params.id);
    const todo = yield db_1.default.todos.update({
        where: {
            id: todoId
        },
        data: {
            completedAt: new Date()
        }
    });
    const allTodos = yield db_1.default.todos.findMany({
        orderBy: {
            createdAt: 'asc' // or 'asc' for oldest first
        }
    });
    res.json({ todos: allTodos });
}));
app.post("/todos/:id/uncompletions", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const todoId = parseInt(req.params.id);
    const todo = yield db_1.default.todos.update({
        where: {
            id: todoId
        },
        data: {
            completedAt: null
        }
    });
    const allTodos = yield db_1.default.todos.findMany({
        orderBy: {
            createdAt: 'asc' // or 'asc' for oldest first
        }
    });
    res.json({ todos: allTodos });
}));
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
