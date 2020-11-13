const axios = require("axios");

const ENDPOINT = "http://localhost:3000";

test("cannot signup without username/password", () => {
  return axios.post(ENDPOINT + "/api/user/signup").catch((e) => {
    expect(e.response.status).toBe(400);
    expect(e.response.data.error).toMatch("Missing");
  });
});

test("cannot signup with exists username", () => {
  return axios
    .post(ENDPOINT + "/api/user/signup", {
      username: "user",
      password: "pass",
    })
    .catch((e) => {
      expect(e.response.status).toBe(400);
      expect(e.response.data.error).toMatch("token");
    });
});

function randomString(len = 6) {
  function random(limit) {
    return Math.floor(Math.random() * limit);
  }
  function randomChar() {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
      "abcdefghijklmnopqrstuvwxyz" +
      "0123456789" +
      "_-";
    return chars[random(chars.length)];
  }
  let s = "";
  for (let i = 0; i < len; i++) {
    s += randomChar();
  }
  return s;
}

test("can signup with new username", () => {
  const username = randomString();
  const password = randomString();
  return axios
    .post(ENDPOINT + "/api/user/signup", {
      username,
      password,
    })
    .catch((resp) => {
      expect(resp.status).toBe(200);
    });
});
