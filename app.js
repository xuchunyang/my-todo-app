require("dotenv").config();
const debug = require("debug")("app");
const express = require("express");
const morgan = require("morgan");
const pug = require("pug");
const cookieSession = require("cookie-session");
const { addUser, verifyUser } = require("./user.js");

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

const renderIndex = pug.compileFile("views/index.pug");
app.get("/", (req, res) => {
  const { user, loginError, signupError } = req.session;
  res.send(renderIndex({ user, loginError, signupError }));
});

const port = 3000;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/`);
});
