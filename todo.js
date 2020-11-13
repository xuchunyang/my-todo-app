const todos = [
  {
    user: "user",
    content: "cut hair",
    done: false,
  },
];

function addTodo(user, content) {
  todos.push({ user, content, done: false });
}

function getTodos(user) {
  return todos.filter((todo) => todo.user === user);
}

module.exports = { addTodo, getTodos };
