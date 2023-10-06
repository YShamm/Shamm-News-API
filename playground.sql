\c nc_news_test
UPDATE articles SET votes=votes + $2 WHERE article_id = $1 RETURNING *;
SELECT * FROM articles WHERE article_id =3;
SELECT * FROM articles;
SELECT * FROM comments;
SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY created_at DESC; 
-- ORDER BY created_at DESC;



SELECT comment_id, votes, created_at, author, body, article_id FROM comments WHERE article_id = 3;

SELECT * FROM comments WHERE article_id =3;

SELECT * FROM comments WHERE article_id = 3 ORDER BY created_at DESC;
-- ORDER BY created_at DESC;
