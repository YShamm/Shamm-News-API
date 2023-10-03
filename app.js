const express = require("express");

const app = express();
const { getTopics, getAPI } = require("./controllers/api.controllers");

//GET ENDPOINTS
app.get("/api/topics", getTopics);
app.get("/api", getAPI);

//error handling middleware
app.use((request, response, next) => {
  response.status(404).send({ msg: "not found" });
  next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
});
module.exports = app;
