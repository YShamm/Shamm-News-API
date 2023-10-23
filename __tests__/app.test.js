const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");
const endpoints = require("../endpoints.json");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  test("status 200, responds w/ array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const topics = response.body;
        expect(topics).toBeInstanceOf(Array);
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });

  test("endpoint does not exist, responds w/ 400 error", () => {
    return request(app)
      .get("/api/topicz")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("not found");
      });
  });
});

describe("GET /API", () => {
  test("status 200; responds w/ an object describing all available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const API = response.body;
        expect(API).toEqual(endpoints);
      });
  });
});

describe("GET /api/articles/:article_id, gets an article by its id", () => {
  test("status 200; returns article w/ correct id and required properties", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then((response) => {
        const article = response.body.article; //ensures it is on a key of article
        expect(article).toHaveProperty("title", expect.any(String)); //note: the property needs to be in ""
        expect(article).toHaveProperty("topic", expect.any(String));
        expect(article).toHaveProperty("author", expect.any(String));
        expect(article).toHaveProperty("body", expect.any(String));
        expect(article).toHaveProperty("created_at", expect.any(String));
        expect(article).toHaveProperty("votes", expect.any(Number));
        expect(article).toHaveProperty("article_img_url", expect.any(String));
        expect(article).toHaveProperty("article_id", 3);

        expect(article).toEqual({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("status 404; id not found - id type correct but does not exist", () => {
    return request(app)
      .get("/api/articles/9000")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article id not found");
      });
  });
  test("status 400; invalid id type - id type incorrect", () => {
    return request(app)
      .get("/api/articles/three")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("invalid id");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("responds with an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .then((response) => {
        const comments = response.body.comments; //array of comments
        expect(comments).toBeInstanceOf(Array);
        expect(comments.length).toBe(2);
        expect(comments).toBeSortedBy("created_at", { descending: true });

        console.log(comments, "log of comments in TEST");
        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
        });

        expect(comments[0]).toHaveProperty("comment_id", 11);
        expect(comments[0]).toHaveProperty("votes", 0);
        expect(comments[0]).toHaveProperty(
          "created_at",
          "2020-09-19T23:10:00.000Z"
        );
        expect(comments[0]).toHaveProperty("author", "icellusedkars");
        expect(comments[0]).toHaveProperty("body", "Ambidextrous marsupial");
        expect(comments[0]).toHaveProperty("article_id", 3);

        expect(comments[1]).toHaveProperty("comment_id", 10);
        expect(comments[1]).toHaveProperty("votes", 0);
        expect(comments[1]).toHaveProperty(
          "created_at",
          "2020-06-20T07:24:00.000Z"
        );
        expect(comments[1]).toHaveProperty("author", "icellusedkars");
        expect(comments[1]).toHaveProperty("body", "git push origin master");
        expect(comments[1]).toHaveProperty("article_id", 3);
      });
  });
  test("status 404; id not found - id type correct but does not exist", () => {
    return request(app)
      .get("/api/articles/9000/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article id not found");
      });
  });
  test("status 400; invalid id type - id type incorrect", () => {
    return request(app)
      .get("/api/articles/three/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("invalid id");
      });
  });
  test("status 200; returns empty array when article has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .then((response) => {
        const comments = response.body.comments; //array of comments
        console.log(response.body, "res in TEST");
        expect(comments).toBeInstanceOf(Array);
        expect(comments.length).toBe(0);
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET /api/articles, gets all articles", () => {
  test("responds with an array of all article objects sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const articles = response.body;
        //console.log(response.body, "response in TEST");
        expect(articles.length).toBe(13);
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        articles.forEach((article) => {
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
          expect(article).toHaveProperty("comment_count", expect.any(String));
        });
      });
  });
  test("responds with articles filtered by the topic value specified in the query", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then((response) => {
        const articles = response.body;
        expect(articles.length).toBe(1);
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toBeSortedBy("created_at", { descending: true });

        articles.forEach((article) => {
          expect(article).toHaveProperty("topic", "cats");
        });
      });
  });

  test("status 404; topic not found - topic type correct but does not exist", () => {
    return request(app)
      .get("/api/articles?topic=hats")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("topic not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("vote up an article", () => {
    const newVotes = { inc_votes: 10 };

    return request(app)
      .patch("/api/articles/3")
      .send(newVotes)
      .expect(200) //its 200 bc we return
      .then((response) => {
        console.log(response.body, "res in TEST");
        expect(response.body.article).toEqual({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 10,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
        expect(response.body.article.votes).toBe(10);
      });
  });

  test("status 400; bad request, invalid data type", () => {
    const newVotes = { inc_votes: "ten" };

    return request(app)
      .patch("/api/articles/3")
      .send(newVotes)
      .expect(400)
      .then((response) => {
        console.log(response.body.msg, "err msg in TEST");
        expect(response.body.msg).toBe("invalid id");
      });
  });

  test("status 400; bad request, empty object", () => {
    const newVotes = {};
    return request(app)
      .patch(`/api/articles/3`)
      .send(newVotes)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("no change in vote");
      });
  });

  test("status:404, correct data type but id does not exist to update ", () => {
    return request(app)
      .patch(`/api/articles/99999`)
      .send({ inc_votes: 10 })
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article id not found");
      });
  });
  test("status: 400, invalid Id not a number cant patch wrong data type", () => {
    return request(app)
      .patch(`/api/articles/not-an-id`)
      .send({ inc_votes: 10 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid id");
      });
  });
});

describe("POST /api/articles/:article_id/comments; adds a comment for an article by article id", () => {
  test("posts a comment w/ a username and body", () => {
    const newComment = { username: "rogersop", body: "great article!" }; //in my model do need to change username to author?

    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        console.log(response, "response in TEST");
        // expect(response.body.comment.author).toBe("rogersop");
        expect(response.body.comment).toHaveProperty("author", "rogersop");
        expect(response.body.comment).toHaveProperty("body", "great article!");
        expect(response.body.comment).toHaveProperty("article_id", 3);
        expect(response.body.comment).toHaveProperty("comment_id", 19);
        expect(response.body.comment).toHaveProperty("created_at");
        expect(response.body.comment).toHaveProperty("votes", 0);
        expect(response.body.comment).toHaveProperty(
          "created_at",
          expect.any(String)
        );
      });
  });

  test("status 400; id type invalid", () => {
    const newComment = { username: "rogersop", body: "great article!" };

    return request(app)
      .post("/api/articles/three/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("invalid id");
      });
  });

  test("status 404; id not found - id type correct but does not exist", () => {
    const newComment = { username: "rogersop", body: "great article!" };

    return request(app)
      .post("/api/articles/3000/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("username/article id not found");
      });
  });

  test("status 201; ignores unnecessary properties", () => {
    const newComment = {
      username: "rogersop",
      body: "great article!",
      unnecessaryProp: "something to be ignored",
    }; //in my model do need to change username to author? A: yes

    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        expect(response.body.comment).toEqual({
          author: "rogersop",
          body: "great article!",
          article_id: 3,
          comment_id: 19,
          created_at: expect.any(String),
          votes: 0,
        });
      });
  });

  test("status:400, bad request - not correctly formatted", () => {
    const newComment = {
      body: "who am i?",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("bad request; incorrect format");
      });
  });

  test("status 404; posts a comment w/ a username that does not exist; returns error", () => {
    const newComment = { username: "yshamm", body: "great article!" };

    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        console.log(response, "response in TEST");
        expect(response.body.msg).toBe("username/article id not found");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("deletes a comment by comment_id", () => {
    return request(app).delete("/api/comments/5").expect(204);
  });

  test("status 404 id not found", () => {
    return request(app)
      .delete("/api/comments/90")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("comment id not found");
      });
  });

  test("status 400; invalid id type - comment id type incorrect", () => {
    return request(app)
      .delete("/api/comments/three")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("invalid id");
      });
  });
});

describe("GET /api/users, gets all users", () => {
  test("Status 200 responds with an array of all user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        const users = response.body;
        //console.log(response.body, "response in TEST");
        expect(users.length).toBe(4);
        expect(users).toBeInstanceOf(Array);
        users.forEach((user) => {
          expect(user).toHaveProperty("username", expect.any(String));
          expect(user).toHaveProperty("name", expect.any(String));
          expect(user).toHaveProperty("avatar_url", expect.any(String));
        });
      });
  });

  test("endpoint does not exist, responds w/ 400 error", () => {
    return request(app)
      .get("/api/userss")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("not found");
      });
  });
});
