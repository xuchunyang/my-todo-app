require("dotenv").config();
const debug = require("debug")("app");
const express = require("express");
const morgan = require("morgan");
const pug = require("pug");
const cookieSession = require("cookie-session");
const { addUser, verifyUser } = require("./user.js");
const { addTodo, getTodos, deleteTodo, doneTodo } = require("./todo.js");

const app = express();

app.disable("x-powered-by");

app.use(morgan("dev"));

app.set("trust proxy", 1);

app.use((req, res, next) => {
  const { ip, protocol } = req;
  debug("req: %o", { ip, protocol });
  next();
});

app.use((req, res, next) => {
  if (req.path === "/") {
    debug("Don't check referer for /");
    next();
    return;
  }
  const referer = req.get("referer");
  debug("Checking referer, referer: %s", referer);
  if (
    referer &&
    !(referer.includes("localhost") || referer.includes("xuchunyang"))
  ) {
    res.status(400).send(`Ignore unknown referer request: ${referer}`);
    return;
  }
  next();
});

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(
  cookieSession({
    secret: process.env.COOKIE_SECRET,
    sameSite: "strict",
  })
);

app.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
  addUser(username, password)
    .then(() => {
      req.session.user = username;
      res.redirect(302, "/");
      debug("created user %s", username);
    })
    .catch((e) => {
      req.session.signupError = e.message;
      res.redirect(302, "/");
      debug(e);
      debug("created user failed: %s", e.message);
    });
});

app.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  verifyUser(username, password)
    .then(() => {
      req.session.user = username;
      res.redirect(302, "/");
      debug("%s login successfully", username);
    })
    .catch((e) => {
      req.session.loginError = e.message;
      res.redirect(302, "/");
      debug("%s login failed: %s", username, e.message);
    });
});

app.get("/logout", (req, res) => {
  req.session = null;
  res.redirect(302, "/");
});

app.get("/todo/delete", (req, res, next) => {
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
  deleteTodo(user, id)
    .then(() => {
      res.redirect("/");
    })
    .catch(next);
});

app.get("/todo/done", (req, res, next) => {
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
  doneTodo(user, id)
    .then(() => {
      res.redirect("/");
    })
    .catch(next);
});

app.post("/todo/add", (req, res, next) => {
  const user = req.session.user;
  if (!user) {
    debug("invalid access");
    res.status(401).end();
    return;
  }
  const { content } = req.body;
  if (!content) {
    res.status(400).send("Can't add todo, you didn't provide its content");
    return;
  }
  addTodo(user, content)
    .then(() => {
      debug("%s added todo %s", user, content);
      res.redirect("/");
    })
    .catch(next);
});

const renderIndex = pug.compileFile("views/index.pug");
app.get("/", (req, res, next) => {
  const data = {};
  const { user, loginError, signupError } = req.session;
  Object.assign(data, { user, loginError, signupError });
  if (user) {
    getTodos(user)
      .then((todos) => {
        data.todos = todos;
        debug("%s has %d todos", user, data.todos.length);
        res.send(renderIndex(data));
      })
      .catch(next);
    return;
  }
  res.send(renderIndex(data));
});

app.use(express.static("public"));

const port = 4777;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/`);
});

process.on("SIGTERM", () => {
  debug("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    debug("HTTP server closed");
    const DB = require("./db.js");
    DB.db.close(() => {
      debug("Database connection closed");
    });
  });
});
