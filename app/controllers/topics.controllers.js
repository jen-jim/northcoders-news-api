const {
    selectTopics,
    selectArticleByArticleId
} = require("../models/topics.models");

exports.getTopics = (request, response, next) => {
    selectTopics()
        .then((topics) => {
            response.status(200).send({ topics });
        })
        .catch((error) => {
            next(error);
        });
};

exports.getArticleByArticleId = (request, response, next) => {
    const { article_id } = request.params;
    selectArticleByArticleId(article_id)
        .then((article) => {
            response.status(200).send({ article });
        })
        .catch((error) => {
            next(error);
        });
};
