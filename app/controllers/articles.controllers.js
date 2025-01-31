const {
    selectArticleByArticleId,
    selectArticles,
    selectCommentsByArticleId,
    insertComment,
    updateArticle
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

exports.getArticles = (request, response, next) => {
    const { sort_by, order, topic } = request.query;
    selectArticles(sort_by, order, topic)
        .then((articles) => {
            response.status(200).send({ articles });
        })
        .catch((error) => {
            next(error);
        });
};

exports.getCommentsByArticleId = (request, response, next) => {
    const { article_id } = request.params;
    selectArticleByArticleId(article_id)
        .then(() => {
            return selectCommentsByArticleId(article_id);
        })
        .then((comments) => {
            response.status(200).send({ comments });
        })
        .catch((error) => {
            next(error);
        });
};

exports.postComment = (request, response, next) => {
    const { article_id } = request.params;
    selectArticleByArticleId(article_id)
        .then(() => {
            const newComment = request.body;
            return insertComment(newComment, article_id);
        })
        .then((newComment) => {
            response.status(201).send({ comment: newComment });
        })
        .catch((error) => {
            next(error);
        });
};

exports.patchArticle = (request, response, next) => {
    const { article_id } = request.params;
    selectArticleByArticleId(article_id)
        .then(() => {
            const newVote = request.body.inc_votes;
            return updateArticle(newVote, article_id);
        })
        .then((updatedArticle) => {
            response.status(200).send({ article: updatedArticle });
        })
        .catch((error) => {
            next(error);
        });
};
