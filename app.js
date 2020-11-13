const debug = require("debug")("app");
const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(morgan("dev"));

const port = 3000;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/`);
});
