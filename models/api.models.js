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
      console.log(response.rows, "fetch response in model");
      if (response.rows.length === 0) {
        //   if (response.rows === []) {
        return Promise.reject({
          status: 404,
          msg: "article id not found",
        });
      } else {
        return response.rows[0];
      }
    });
}

module.exports = { fetchTopics, fetchArtileById };
