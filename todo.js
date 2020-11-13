const debug = require("debug")("app:todo");
const DB = require("./db.js");
const todos = [
  {
    user: "user",
    content: "cut hair",
    done: false,
    id: 0,
  },
];

async function addTodo(user, content) {
  await DB.run(`INSERT INTO todos (username, content, done) VALUES (?, ?, ?)`, [
    user,
    content,
    false,
  ]);
}

async function deleteTodo(user, id) {
  const todo = await DB.get("SELECT * FROM todos WHERE id = ?", [id]);
  if (!todo) throw new Error("No such todo id");
  if (todo.username !== user) {
    debug("user %s can not delete other's todo %o", user, todo);
    throw new Error("You are not the owner of the todo");
  }
  await DB.run("DELETE FROM todos WHERE id = ?", [id]);
  debug("todo %o deleted", todo);
}

async function doneTodo(user, id) {
  await DB.run("UPDATE todos SET done = true where id = ? AND username = ?", [
    id,
    user,
  ]);
  debug("%s mark todo #%d as done", user, id);
}

async function getTodos(user) {
  return await DB.all(`SELECT * FROM todos WHERE username = ?`, [user]);
}

module.exports = { addTodo, getTodos, deleteTodo, doneTodo };
