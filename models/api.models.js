const { response } = require("../app");
const db = require("../db/connection");

function fetchTopics() {
  return db.query(`SELECT * FROM topics`).then((response) => {
    return response.rows;
  });
}

function fetchArtileById(id) {
  console.log(id, "ID IN MODEL");
  return db
    .query(
      `SELECT articles.*, COUNT(comments.article_id) ::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;`,
      [id]
    ) ///THIS IS WHAT WE CHANGE
    .then((response) => {
      console.log(response, "RESPONSE IN MODEL");
      if (response.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "article id not found",
        });
      } else {
        return response.rows[0];
      }
    });
  // .catch((err) => {
  //   console.log(err, "ERR IN MODEL");
  // });
}

function fetchCommentsById(id) {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`,
      [id]
    )
    .then((response) => {
      return response.rows;
    });
}
function fetchArticles() {
  //console.log("made it to models");
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY created_at DESC;`
    )
    .then((response) => {
      //console.log(response.rows, "response in models");
      return response.rows;
    });
}

module.exports = {
  fetchTopics,
  fetchArtileById,
  fetchCommentsById,
  fetchArticles,
};
