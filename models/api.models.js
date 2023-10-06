const { urlencoded } = require("express");
const { response } = require("../app");
const db = require("../db/connection");

function fetchTopics() {
  return db.query(`SELECT * FROM topics`).then((response) => {
    return response.rows;
  });
}

function fetchArtileById(id) {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [id])
    .then((response) => {
      if (response.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "article id not found",
        });
      } else {
        return response.rows[0];
      }
    });
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
    return response.rows;
  });
  //}
}

module.exports = {
  fetchTopics,
  fetchArtileById,
  fetchCommentsById,
  fetchArticles,
};
