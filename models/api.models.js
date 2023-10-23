const { urlencoded } = require("express");
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
function fetchArticles(topic) {
  console.log("made it to models");

  urlQuery = [];

  let query = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id`;

  if (topic) {
    query += ` WHERE articles.topic = $1`;
    urlQuery.push(topic);
  }

  query += ` GROUP BY articles.article_id ORDER BY created_at DESC`;

  query += `;`;

  // if (topic) {
  //   return db.query(query, [topic]).then((response) => {
  //     //i think [topic] is causing prob; but its the only way to prevent injection
  //     //console.log(response.rows, "response in models");
  //     return response.rows;
  //   });
  // } else {
  return db.query(query, urlQuery).then((response) => {
    if (response.rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "topic not found",
      });
    } else {
      return response.rows;
    }
  });
  //}
}
function addCommentById(id, username, body) {
  if (!username || !body) {
    return Promise.reject({
      status: 400,
      msg: "bad request; incorrect format",
    });
  } else {
    return db
      .query(
        `INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *;`, //can't use %L here. need to use $ syntax
        [body, username, id]
      )
      .then((response) => {
        //console.log(response.rows, "response in MODEL");   //this custom error didnt work. used psql error handler instead.
        //   if (response.rows.length === 0) {
        //     return Promise.reject({
        //       status: 404,
        //       msg: "article id not found",
        //     });
        //   } else {
        return response.rows[0];
        //  }
      });
  }
}

function updateArticleVotes(id, inc_votes) {
  //console.log(id, "id in MODEL");
  if (!inc_votes) {
    return Promise.reject({
      status: 400,
      msg: "no change in vote",
    });
  } else {
    return db
      .query(
        `UPDATE articles SET votes=votes + $2 WHERE article_id = $1 RETURNING *;`,
        [id, inc_votes]
      )
      .then((response) => {
        if (response.rows.length === 0) {
          return Promise.reject({
            status: 404,
            msg: "article id not found",
          });
        }
        return response.rows[0];
      });
  }
}

function removeComment(id) {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING*`, [id])
    .then((response) => {
      if (response.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "comment id not found",
        });
      } else {
        return response.rows[0];
      }
    });
}

function fetchAllUsers() {
  return db.query(`SELECT * FROM users`).then((response) => {
    return response.rows;
  });
}

module.exports = {
  fetchTopics,
  fetchArtileById,
  fetchCommentsById,
  fetchArticles,
  updateArticleVotes,
  addCommentById,
  removeComment,
  fetchAllUsers,
};
