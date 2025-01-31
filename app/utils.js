const db = require("../db/connection");

exports.checkTopicExists = (slug) => {
    return db
        .query(
            `SELECT * FROM topics
            WHERE slug = $1`,
            [slug]
        )
        .then(({ rows }) => {
            if (slug && rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: "Topic not found"
                });
            } else {
                return;
            }
        });
};
