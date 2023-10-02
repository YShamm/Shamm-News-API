const { fetchTopics } = require("../models/api.models");

exports.getTopics = (request, response, next) => {
  //   console.log("Start of controller");
  fetchTopics()
    .then((topics) => {
      // console.log(topics, "response in controller");
      response.status(200).send(topics);
    })
    // .catch(next);
    .catch((err) => {
      next(err);
    });
};
