const {
  fetchTopics,
  fetchArtileById,
  fetchCommentsById,
  fetchArticles,
} = require("../models/api.models");
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
  const id = request.params.article_id;
  fetchArtileById(id)
    .then((fetchedArticle) => {
      response.status(200).send({ article: fetchedArticle });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsById = (request, response, next) => {
  const id = request.params.article_id;
  fetchArtileById(id)
    .then(() => {
      fetchCommentsById(id).then((fetchedComments) => {
        response.status(200).send({
          comments: fetchedComments, //why does a comma appear here but not on line 27?
        });
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (request, response, next) => {
  console.log("i am in controller");
  const topic = request.query.topic;
  fetchArticles(topic)
    .then((articles) => {
      response.status(200).send(articles);
    })
    .catch((err) => {
      next(err);
    });
};
