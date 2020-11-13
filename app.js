const debug = require("debug")("app");
const express = require("express");
const morgan = require("morgan");
const { addUser } = require("./user.js");

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

const port = 3000;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/`);
});
