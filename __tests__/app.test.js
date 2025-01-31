const request = require("supertest");
const app = require("../app/app");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const endpointsJson = require("../endpoints.json");

beforeEach(() => {
    return seed(testData);
});

afterAll(() => {
    return db.end();
});

describe("GET /api", () => {
    test("200: Responds with an object detailing the documentation for each endpoint", () => {
        return request(app)
            .get("/api")
            .expect(200)
            .then(({ body: { endpoints } }) => {
                expect(endpoints).toEqual(endpointsJson);
            });
    });
});

describe("GET /api/topics", () => {
    test("200: Responds with an array of topic objects that have description and slug properties", () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({ body: { topics } }) => {
                expect(topics.length).toBe(3);

                topics.forEach((topic) => {
                    expect(typeof topic.description).toBe("string");
                    expect(typeof topic.slug).toBe("string");
                });
            });
    });
});

describe("GET /api/articles/:article_id", () => {
    test("200: Responds with the correct article with its properties", () => {
        return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body: { article } }) => {
                expect(article).toEqual({
                    article_id: 1,
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    created_at: "2020-07-09T20:11:00.000Z",
                    votes: 100,
                    article_img_url:
                        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
                });
            });
    });
    test("404: Responds with not found when given article_id is out of range", () => {
        return request(app)
            .get("/api/articles/9999")
            .expect(404)
            .then(({ body: { error } }) => {
                expect(error).toBe("Article not found");
            });
    });
    test("400: Responds with bad request when given article_id is not valid", () => {
        return request(app)
            .get("/api/articles/A")
            .expect(400)
            .then(({ body: { error } }) => {
                expect(error).toBe("Bad request");
            });
    });
});

describe("GET /api/articles", () => {
    test("200: Responds with an array of article objects with correct properties", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body: { articles } }) => {
                expect(articles.length).toBe(13);

                articles.forEach((article) => {
                    expect(typeof article.article_id).toBe("number");
                    expect(typeof article.title).toBe("string");
                    expect(typeof article.topic).toBe("string");
                    expect(typeof article.author).toBe("string");
                    expect(typeof article.created_at).toBe("string");
                    expect(typeof article.votes).toBe("number");
                    expect(typeof article.article_img_url).toBe("string");
                    expect(typeof article.comment_count).toBe("number");
                    expect(article).not.toHaveProperty("body");
                });
            });
    });
    test("200: Responds with an array of article objects with the correct amount of comment count", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body: { articles } }) => {
                const article1 = articles.find(
                    (article) => article.article_id === 1
                );

                expect(article1.comment_count).toBe(11);
            });
    });
    test("200: Responds with an array of article objects sorted by created at in descending order", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body: { articles } }) => {
                expect(articles).toBeSortedBy("created_at", {
                    descending: true
                });
            });
    });
});

describe("GET /api/articles/:article_id/comments", () => {
    test("200: Responds with an array of comments for the given article id with correct properties", () => {
        return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body: { comments } }) => {
                expect(comments.length).toBe(11);

                comments.forEach((comment) => {
                    expect(typeof comment.comment_id).toBe("number");
                    expect(typeof comment.body).toBe("string");
                    expect(typeof comment.article_id).toBe("number");
                    expect(typeof comment.author).toBe("string");
                    expect(typeof comment.votes).toBe("number");
                    expect(typeof comment.created_at).toBe("string");
                });
            });
    });
    test("200: Responds with an array of comments for the given article id sorted by created at in descending order", () => {
        return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body: { comments } }) => {
                expect(comments).toBeSortedBy("created_at", {
                    descending: true
                });
            });
    });
    test("200: Responds with an empty array when given article_id doesn't have any comments", () => {
        return request(app)
            .get("/api/articles/2/comments")
            .expect(200)
            .then(({ body: { comments } }) => {
                expect(comments).toEqual([]);
            });
    });
    test("404: Responds with not found when given article_id is out of range", () => {
        return request(app)
            .get("/api/articles/9999/comments")
            .expect(404)
            .then(({ body: { error } }) => {
                expect(error).toBe("Article not found");
            });
    });
    test("400: Responds with bad request when given article_id is not valid", () => {
        return request(app)
            .get("/api/articles/A/comments")
            .expect(400)
            .then(({ body: { error } }) => {
                expect(error).toBe("Bad request");
            });
    });
});

describe("POST /api/articles/:article_id/comments", () => {
    test("201: Responds with the posted comment with correct properties", () => {
        return request(app)
            .post("/api/articles/1/comments")
            .send({
                body: "fruit pastilles seconded",
                author: "rogersop"
            })
            .expect(201)
            .then(({ body: { comment } }) => {
                expect(typeof comment.comment_id).toBe("number");
                expect(comment.body).toBe("fruit pastilles seconded");
                expect(typeof comment.article_id).toBe("number");
                expect(comment.author).toBe("rogersop");
                expect(comment.votes).toBe(0);
                expect(typeof comment.created_at).toBe("string");
            });
    });
    test("404: Responds with not found when given article_id is out of range", () => {
        return request(app)
            .post("/api/articles/9999/comments")
            .send({
                body: "fruit pastilles seconded",
                author: "rogersop"
            })
            .expect(404)
            .then(({ body: { error } }) => {
                expect(error).toBe("Article not found");
            });
    });
    test("400: Responds with bad request when given article_id is not valid", () => {
        return request(app)
            .post("/api/articles/A/comments")
            .send({
                body: "fruit pastilles seconded",
                author: "rogersop"
            })
            .expect(400)
            .then(({ body: { error } }) => {
                expect(error).toBe("Bad request");
            });
    });
    test("400: Responds with bad request when new comment has missing keys/malformed input", () => {
        return request(app)
            .post("/api/articles/1/comments")
            .send({
                body: "fruit pastilles seconded",
                user: "rogersop"
            })
            .expect(400)
            .then(({ body: { error } }) => {
                expect(error).toBe("Bad request");
            });
    });
    test("404: Responds with not found when author is not a valid user", () => {
        return request(app)
            .post("/api/articles/1/comments")
            .send({
                body: "fruit pastilles seconded",
                author: "jenjenjen"
            })
            .expect(404)
            .then(({ body: { error } }) => {
                expect(error).toBe("User not found");
            });
    });
});

describe("PATCH /api/articles/:article_id", () => {
    test("200: Responds with the updated article when increasing votes", () => {
        return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: 1 })
            .expect(200)
            .then(({ body: { article } }) => {
                expect(article).toEqual({
                    article_id: 1,
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    created_at: "2020-07-09T20:11:00.000Z",
                    votes: 101,
                    article_img_url:
                        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
                });
            });
    });
    test("200: Responds with the updated article when decreasing votes", () => {
        return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: -100 })
            .expect(200)
            .then(({ body: { article } }) => {
                expect(article).toEqual({
                    article_id: 1,
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    created_at: "2020-07-09T20:11:00.000Z",
                    votes: 0,
                    article_img_url:
                        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
                });
            });
    });
    test("404: Responds with not found when given article_id is out of range", () => {
        return request(app)
            .patch("/api/articles/9999")
            .send({ inc_votes: 1 })
            .expect(404)
            .then(({ body: { error } }) => {
                expect(error).toBe("Article not found");
            });
    });
    test("400: Responds with bad request when given article_id is not valid", () => {
        return request(app)
            .patch("/api/articles/A")
            .send({ inc_votes: 1 })
            .expect(400)
            .then(({ body: { error } }) => {
                expect(error).toBe("Bad request");
            });
    });
    test("400: Responds with bad request when input has incorrect data type", () => {
        return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: "one" })
            .expect(400)
            .then(({ body: { error } }) => {
                expect(error).toBe("Bad request");
            });
    });
});
