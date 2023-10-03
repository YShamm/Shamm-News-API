const express = require("express");

const app = express();
const {
  getTopics,
  getAPI,
  getArticleById,
} = require("./controllers/api.controllers");

//GET ENDPOINTS
app.get("/api/topics", getTopics);
app.get("/api", getAPI);
app.get("/api/articles/:article_id", getArticleById);

//error handling middleware
app.use((request, response, next) => {
  response.status(404).send({ msg: "not found" });
  next(err);
});

//custom error handler
app.use((err, req, res, next) => {
  console.log(err, "ERR IN APP.JS");
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
});

//psql error handler
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "invalid id" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
});
module.exports = app;
