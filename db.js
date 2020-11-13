const sqlite3 =
  process.env.NODE_ENV === "production"
    ? require("sqlite3")
    : require("sqlite3").verbose();

const db = new sqlite3.Database("my-todo-app.sqlite");

const promisify = (fun) => {
  return (query, params) => {
    return new Promise((resolve, reject) => {
      fun.bind(db)(query, params, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  };
};

// XXX how to use this
let initialized = false;
const init = async () => {
  if (!initialized) {
    await promisify(db.exec)("PRAGMA foreign_keys = ON");
    initialized = true;
  }
};

const DB = { db };
DB.get = promisify(db.get);
DB.all = promisify(db.all);
DB.run = promisify(db.run);

module.exports = DB;
