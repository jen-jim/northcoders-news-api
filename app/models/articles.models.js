const db = require("../../db/connection");
const { checkTopicExists } = require("../utils");

exports.selectArticleByArticleId = (article_id) => {
    let sql = `SELECT
                articles.article_id, title, topic, articles.author, articles.body, articles.created_at, articles.votes, article_img_url,
                COUNT(comment_id)::INT AS comment_count
            FROM articles
            LEFT JOIN comments ON articles.article_id = comments.article_id
            WHERE articles.article_id = $1
            GROUP BY articles.article_id`;

    const values = [article_id];

    return db.query(sql, values).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({
                status: 404,
                msg: "Article not found"
            });
        } else {
            return rows[0];
        }
    });
};

exports.selectArticles = (sort_by = "created_at", order = "DESC", topic) => {
    const greenlist = [
        "article_id",
        "title",
        "topic",
        "author",
        "body",
        "created_at",
        "votes",
        "article_img_url",
        "comment_count"
    ];

    let sql = `SELECT
                articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, article_img_url,
                COUNT(comment_id)::INT AS comment_count
            FROM articles
            LEFT JOIN comments ON articles.article_id = comments.article_id`;

    const values = [];

    if (topic) {
        sql += ` WHERE topic = $1`;
        values.push(topic);
    }

    sql += ` GROUP BY articles.article_id`;

    if (greenlist.includes(sort_by)) {
        sql += ` ORDER BY ${sort_by}`;
    } else {
        return Promise.reject({ status: 400, msg: "Bad request" });
    }

    order = order.toUpperCase();
    if (order === "ASC" || order === "DESC") {
        sql += ` ${order}`;
    } else {
        return Promise.reject({ status: 400, msg: "Bad request" });
    }

    return checkTopicExists(topic)
        .then(() => {
            return db.query(sql, values);
        })
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

exports.insertComment = (newComment, article_id) => {
    const { body, author } = newComment;
    return db
        .query(
            `INSERT INTO comments (body, author, article_id)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [body, author, article_id]
        )
        .then(({ rows }) => {
            return rows[0];
        });
};

exports.updateArticle = (newVote, article_id) => {
    return db
        .query(
            `UPDATE articles SET votes = votes + $1
            WHERE article_id = $2
            RETURNING *`,
            [newVote, article_id]
        )
        .then(({ rows }) => {
            return rows[0];
        });
};
