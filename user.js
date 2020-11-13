const users = {
  user: "pass",
};

function addUser(username, password) {
  if (!(username && password)) {
    throw new Error("Missing username or password");
  }
  if (username in users) {
    throw new Error("Username token");
  }
  users[username] = password;
}

function verifyUser(username, password) {
  if (username in users && users[username] === password) {
    return;
  } else {
    throw new Error("Wrong username/password");
  }
}

module.exports = { addUser, verifyUser };
