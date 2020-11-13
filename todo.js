const debug = require("debug")("app");
const todos = [
  {
    user: "user",
    content: "cut hair",
    done: false,
    id: 0,
  },
];

function addTodo(user, content) {
  const todo = { user, content, done: false, id: todos.length };
  todos.push(todo);
  return todo;
}

function deleteTodo(user, id) {
  id = parseInt(id);
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) throw new Error("No such todo id");
  const todo = todos[index];
  if (todo.user !== user) {
    debug("user %s can not delete other's todo %o", user, todo);
    throw new Error("You are not the owner of the todo");
  }
  debug("todo %o deleted", todo);
  todos.splice(index, 1);
}

function doneTodo(user, id) {
  id = parseInt(id);
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) throw new Error("No such todo id");
  const todo = todos[index];
  if (todo.user !== user) {
    debug("user %s can not delete other's todo %o", user, todo);
    throw new Error("You are not the owner of the todo");
  }
  debug("done todo %o", todo);
  todo.done = true;
}

function getTodos(user) {
  return todos.filter((todo) => todo.user === user);
}

module.exports = { addTodo, getTodos, deleteTodo, doneTodo };
