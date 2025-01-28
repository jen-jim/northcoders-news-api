const { selectArticleByArticleId } = require("../models/articles.models");

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
