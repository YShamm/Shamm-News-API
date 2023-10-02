const { response } = require("../app");
const db = require("../db/connection");

function fetchTopics() {
  return db.query(`SELECT * FROM topics`).then((response) => {
    // console.log(response.rows, " response in models");
    return response.rows;
  });
}

module.exports = { fetchTopics };
