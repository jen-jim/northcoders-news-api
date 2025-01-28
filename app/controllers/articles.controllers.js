const {
    selectArticleByArticleId,
    selectAllArticles
} = require("../models/articles.models");

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

exports.getAllArticles = (request, response, next) => {
    selectAllArticles()
        .then((articles) => {
            response.status(200).send({ articles });
        })
        .catch((error) => {
            next(error);
        });
};
