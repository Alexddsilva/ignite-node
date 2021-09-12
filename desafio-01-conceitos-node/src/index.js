const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find((oneUser) => oneUser.username === username);

  if (!user) {
    return response.status(404).json({ error: "User not found!" });
  }

  request.user = user;

  return next();
}

app.post("/users", (request, response) => {
  const { name, username, todos = [] } = request.body;

  const userAlreadyExists = users.some(
    (oneUser) => oneUser.username === username
  );

  if (userAlreadyExists) {
    return response.status(400).json({ error: "User already exists!" });
  }

  const id = uuidv4();

  const user = {
    name,
    username,
    todos,
    id,
  };

  users.push(user);

  response.status(201).send(user);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;

  const { todos } = user;

  return response.json(todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, done = false, deadline } = request.body;

  const created_at = new Date();

  const id = uuidv4();

  const todo = { id, title, done, deadline: new Date(deadline), created_at };
  user.todos.push(todo);

  return response.status(201).json(todo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const { title, deadline } = request.body;

  const findedTodo = user.todos.find((todo) => todo.id === id);

  if (!findedTodo) {
    return response.status(404).json({ error: "todo not found!" });
  }

  const index = user.todos.findIndex((todo) => todo.id === id);

  const todo = {
    ...findedTodo,
    title,
    deadline,
  };

  user.todos[index] = todo;

  return response.json(todo);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find((findTodo) => findTodo.id === id);

  if (!todo) {
    return response.status(404).json({ error: "todo not found!" });
  }

  todo.done = true;
  return response.json(todo);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find((findTodo) => findTodo.id === id);

  if (!todo) {
    return response.status(404).json({ error: "todo not found!" });
  }

  user.todos.splice(todo, 1);

  return response.status(204).send();
});

module.exports = app;
