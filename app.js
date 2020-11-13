require("dotenv").config();
const debug = require("debug")("app");
const express = require("express");
const morgan = require("morgan");
const pug = require("pug");
const cookieSession = require("cookie-session");
const { addUser, verifyUser } = require("./user.js");
const { addTodo, getTodos, deleteTodo, doneTodo } = require("./todo.js");

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use(
  cookieSession({
    secret: process.env.COOKIE_SECRET,
  })
);

app.get("/signup", (req, res) => {
  const { username, password } = req.query;
  try {
    addUser(username, password);
    req.session.user = username;
    res.redirect(302, "/");
    debug("created user %s", username);
  } catch (e) {
    req.session.signupError = e.message;
    res.redirect(302, "/");
    debug("created user failed: %s", e.message);
  }
});

app.get("/login", (req, res) => {
  const { username, password } = req.query;
  try {
    verifyUser(username, password);
    req.session.user = username;
    res.redirect(302, "/");
    debug("%s login successfully", username);
  } catch (e) {
    req.session.loginError = e.message;
    res.redirect(302, "/");
    debug("%s login failed: %s", username, e.message);
  }
});

app.get("/logout", (req, res) => {
  req.session = null;
  res.redirect(302, "/");
});

app.get("/todo/delete", (req, res) => {
  const user = req.session.user;
  if (!user) {
    debug("invalid access");
    res.status(401).end();
    return;
  }
  const { id } = req.query;
  if (!id) {
    res.status(400).send("Missing id");
    return;
  }
  debug("%s wants to delete todo #%d", user, id);
  // handle exception?
  deleteTodo(user, id);
  res.redirect("/");
});

app.get("/todo/done", (req, res) => {
  const user = req.session.user;
  if (!user) {
    debug("invalid access");
    res.status(401).end();
    return;
  }
  const { id } = req.query;
  if (!id) {
    res.status(400).send("Missing id");
    return;
  }
  debug("%s wants to mark done todo #%d", user, id);
  // handle exception?
  doneTodo(user, id);
  res.redirect("/");
});

app.get("/todo/add", (req, res) => {
  const user = req.session.user;
  if (!user) {
    debug("invalid access");
    res.status(401).end();
    return;
  }
  const { content } = req.query;
  if (!content) {
    res.status(400).send("Can't add todo, you didn't provide its content");
    return;
  }
  const todo = addTodo(user, content);
  debug("todo added: %o", todo);
  res.redirect("/");
});

const renderIndex = pug.compileFile("views/index.pug");
app.get("/", (req, res) => {
  const data = {};
  const { user, loginError, signupError } = req.session;
  Object.assign(data, { user, loginError, signupError });
  if (user) {
    data.todos = getTodos(user);
    debug("%s has %d todos", user, data.todos.length);
  }
  res.send(renderIndex(data));
});

app.use(express.static("public"));

const port = 3000;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/`);
});
