const debug = require("debug")("app:user");
const DB = require("./db.js");
const bcrypt = require("bcrypt");
const saltRounds = 10;

async function addUser(username, password) {
  if (!(username && password)) {
    throw new Error("Missing username or password");
  }
  const user = await DB.get(`SELECT * FROM users WHERE username = ?`, [
    username,
  ]);
  if (user) {
    throw new Error("Username token");
  }

  const passwordHash = await bcrypt.hash(password, saltRounds);
  await DB.run(`INSERT INTO users (username, passwordHash) VALUES (?, ?)`, [
    username,
    passwordHash,
  ]);
}

async function verifyUser(username, password) {
  const result = await DB.get(
    "SELECT passwordHash FROM users WHERE username = ?",
    [username]
  );
  if (!result) {
    throw new Error("No such user");
  }
  const hash = result.passwordHash;
  debug("Verifying %o", { username, password, passwordHash: hash });
  if (await bcrypt.compare(password, hash)) {
    return;
  } else {
    throw new Error("Wrong username/password");
  }
}

module.exports = { addUser, verifyUser };
