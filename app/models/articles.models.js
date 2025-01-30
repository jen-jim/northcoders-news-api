const db = require("../../db/connection");

exports.selectArticleByArticleId = (article_id) => {
    return db
        .query(
            `SELECT * FROM articles
            WHERE article_id = $1`,
            [article_id]
        )
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "Not found" });
            } else {
                return rows[0];
            }
        });
};

exports.selectAllArticles = () => {
    return db
        .query(
            `SELECT
                articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, article_img_url,
                COUNT(comment_id)::INT AS comment_count
            FROM articles
            LEFT JOIN comments ON articles.article_id = comments.article_id
            GROUP BY articles.article_id
            ORDER BY articles.created_at DESC`
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.selectCommentsByArticleId = (article_id) => {
    return db
        .query(
            `SELECT * FROM comments
            WHERE article_id = $1
            ORDER BY created_at DESC`,
            [article_id]
        )
        .then(({ rows }) => {
            return rows;
        });
};
