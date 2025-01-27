const express = require("express");
const endpoints = require("../endpoints.json");
const { getTopics } = require("./controllers/topics.controllers");
const { getArticleByArticleId } = require("./controllers/articles.controllers");

const app = express();

app.get("/api", (request, response) => {
    response.status(200).send({ endpoints });
});

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleByArticleId);

app.use((error, request, response, next) => {
    if (error.status) {
        response.status(error.status).send({ error: error.msg });
    } else {
        next(error);
    }
});

app.use((error, request, response, next) => {
    if (error.code === "22P02") {
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