const express = require("express");
const endpoints = require("../endpoints.json");
const { getTopics } = require("./controllers/topics.controllers");
const {
    getArticleByArticleId,
    getAllArticles,
    getCommentsByArticleId,
    postComment,
    patchArticle
} = require("./controllers/articles.controllers");
const { deleteComment } = require("./controllers/comments.controllers");
const { getUsers } = require("./controllers/users.controllers");

const app = express();
app.use(express.json());

app.get("/api", (request, response) => {
    response.status(200).send({ endpoints });
});

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleByArticleId);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postComment);
app.patch("/api/articles/:article_id", patchArticle);

app.delete("/api/comments/:comment_id", deleteComment);

app.get("/api/users", getUsers);

app.use((error, request, response, next) => {
    if (error.status && error.msg) {
        response.status(error.status).send({ error: error.msg });
    } else {
        next(error);
    }
});

app.use((error, request, response, next) => {
    if (error.code === "23503") {
        response.status(404).send({ error: "User not found" });
    } else {
        next(error);
    }
});

app.use((error, request, response, next) => {
    if (error.code === "22P02" || error.code === "23502") {
        response.status(400).send({ error: "Bad request" });
    } else {
        next(error);
    }
});

app.use((error, request, response, next) => {
    console.log(error);
    response.status(500).send({ error: "Internal server error" });
});

module.exports = app;
