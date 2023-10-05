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

describe.only("POST /api/articles/:article_id/comments; adds a comment for an article by article id", () => {
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
        expect(response.body.msg).toBe("article id not found");
      });
  });

  test("status 201; ignores unnecessary properties", () => {
    const newComment = {
      username: "rogersop",
      body: "great article!",
      unnecessaryProp: "something to be ignored",
    }; //in my model do need to change username to author?

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

  test("status:400, bad request - incorrectly formatted", () => {
    const id = 2;
    ///to be continued
  });
});
