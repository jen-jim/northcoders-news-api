const express = require("express");
const endpoints = require("../endpoints.json");
const { getTopics } = require("./controllers/topics.controllers");

const app = express();

app.get("/api", (request, response) => {
    response.status(200).send({ endpoints });
});

app.get("/api/topics", getTopics);

module.exports = app;
