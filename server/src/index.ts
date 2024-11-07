// server/index.ts
import express, { Application } from "express";
import prisma from "./db";

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3001;

const app: Application = express();

app.use(express.json());  // for parsing application/json
app.use(express.urlencoded({ extended: true }));  // for parsing application/x-www-form-urlencoded

app.get("/api", async (req, res) => {
  console.log("GET /api");
  const allTodos = await prisma.todos.findMany({
    orderBy: {
      createdAt: 'asc'  // or 'asc' for oldest first
    }
  });
  res.json({ todos: allTodos });
});

app.post("/todos", async (req, res) => {
  console.log("POST /todos");
  const todo = await prisma.todos.create({
    data: {
      title: req.body.title,
    },
  })

  const allTodos = await prisma.todos.findMany({
    orderBy: {
      createdAt: 'asc'  // or 'asc' for oldest first
    }
  });
  res.json({ todos: allTodos });
});

app.post("/todos/:id/completions", async (req, res) => {
  const todoId = parseInt(req.params.id);
  const todo = await prisma.todos.update({
    where: {
      id: todoId
    },
    data: {
      completedAt: new Date()
    }
  });

  const allTodos = await prisma.todos.findMany({
    orderBy: {
      createdAt: 'asc'  // or 'asc' for oldest first
    }
  });
  res.json({ todos: allTodos });
});

app.post("/todos/:id/uncompletions", async (req, res) => {
  const todoId = parseInt(req.params.id);
  const todo = await prisma.todos.update({
    where: {
      id: todoId
    },
    data: {
      completedAt: null
    }
  });

  const allTodos = await prisma.todos.findMany({
    orderBy: {
      createdAt: 'asc'  // or 'asc' for oldest first
    }
  });
  res.json({ todos: allTodos });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});