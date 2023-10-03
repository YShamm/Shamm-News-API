const { fetchTopics, fetchArtileById } = require("../models/api.models");
const endpoints = require("../endpoints.json");

exports.getTopics = (request, response, next) => {
  fetchTopics()
    .then((topics) => {
      response.status(200).send(topics);
    })
    // .catch(next);
    .catch((err) => {
      next(err);
    });
};

exports.getAPI = (request, response, next) => {
  response.status(200).send(endpoints);
};

exports.getArticleById = (request, response, next) => {
  //   console.log(request, "request in controller");
  const id = request.params.article_id;
  fetchArtileById(id)
    .then((fetchedArticle) => {
      console.log(fetchedArticle, "fArticle in controller");
      response.status(200).send({ article: fetchedArticle });
    })
    .catch((err) => {
      next(err);
    });
};
