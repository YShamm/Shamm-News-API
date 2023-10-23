const express = require("express");

const app = express();
const {
  getTopics,
  getAPI,
  getArticleById,
  getCommentsById,
  getArticles,
  patchArticleById,
  postComment,
  deleteComment,
  getUsers,
} = require("./controllers/api.controllers");

app.use(express.json());

//GET ENDPOINTS
app.get("/api/topics", getTopics);
app.get("/api", getAPI);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsById);
app.get("/api/users", getUsers);

app.patch("/api/articles/:article_id", patchArticleById);

//POST ENDPOINTS
app.post("/api/articles/:article_id/comments", postComment);

app.delete("/api/comments/:comment_id", deleteComment);

//error handling middleware
app.use((request, response, next) => {
  response.status(404).send({ msg: "not found" });
  next(err);
});

//custom error handler
app.use((err, req, res, next) => {
  //console.log(err, "custom error");
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
});

//psql error handler
app.use((err, req, res, next) => {
  console.log(err, "psql err in APP");
  if (err.code === "22P02") {
    res.status(400).send({ msg: "invalid id" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "username/article id not found" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  //console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
});
module.exports = app;
