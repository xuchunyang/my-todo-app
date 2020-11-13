const debug = require("debug")("app:user");
const DB = require("./db.js");

async function addUser(username, password) {
  if (!(username && password)) {
    throw new Error("Missing username or password");
  }
  const user = await DB.get(`SELECT * FROM users WHERE username = ?`, [
    username,
  ]);
  debug("user: %o", user);
  if (user) {
    throw new Error("Username token");
  }
  await DB.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [
    username,
    password,
  ]);
}

async function verifyUser(username, password) {
  debug("verifyUser: %s, %s", username, password);
  const user = await DB.get(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password]
  );
  if (user) {
    return;
  } else {
    throw new Error("Wrong username/password");
  }
}

module.exports = { addUser, verifyUser };
