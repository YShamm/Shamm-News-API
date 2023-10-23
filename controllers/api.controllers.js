const {
  fetchTopics,
  fetchArtileById,
  fetchCommentsById,
  fetchArticles,
  addCommentById,
  updateArticleVotes,
  removeComment,
  fetchAllUsers,
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

exports.patchArticleById = (request, response, next) => {
  const id = request.params.article_id;
  const inc_votes = request.body.inc_votes;
  updateArticleVotes(id, inc_votes)
    .then((article) => {
      response.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (request, response, next) => {
  //console.log(request.body, "request in CONTROLLER");
  const id = request.params.article_id;
  const username = request.body.username;
  const body = request.body.body;
  addCommentById(id, username, body)
    .then((addedComment) => {
      response.status(201).send({ comment: addedComment });
    })
    .catch((err) => {
      console.log(err, "custom err in CONTROLLER");
      next(err);
    });
};

exports.deleteComment = (request, response, next) => {
  const id = request.params.comment_id;
  removeComment(id)
    .then((comment) => {
      response.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (request, response, next) => {
  fetchAllUsers()
    .then((users) => {
      response.status(200).send(users);
    })
    .catch((err) => {
      next(err);
    });
};
