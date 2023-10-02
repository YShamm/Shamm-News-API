const { response } = require("../app");
const db = require("../db/connection");

function fetchTopics() {
  return db.query(`SELECT * FROM topics`).then((response) => {
    return response.rows;
  });
}

module.exports = { fetchTopics };
