const debug = require("debug")("app");
const express = require("express");
const morgan = require("morgan");
const { addUser, verifyUser } = require("./user.js");

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.post("/api/user/signup", (req, res) => {
  const { username, password } = req.body;
  try {
    addUser(username, password);
    res.status(201).end();
    debug("created user %s", username);
  } catch (e) {
    res.status(400).json({ error: e.message });
    debug("created user failed: %s", e.message);
  }
});

app.post("/api/user/login", (req, res) => {
  const { username, password } = req.body;
  try {
    verifyUser(username, password);
    res.status(200).end();
    debug("%s login successfully", username);
  } catch (e) {
    res.status(403).json({ error: e.message });
    debug("%s login failed: %s", username, e.message);
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/`);
});
