import express from "express";
import {db} from "../db.js";
const router = express.Router();

// =========================
// GET ALL NEWS
// =========================
router.get("/news", async (req, res) => {
  try {
    console.log("Fetching all news");

    const sql = `
      SELECT id, title, content AS description, image, created_at
      FROM news
      ORDER BY created_at DESC
    `;

    const [result] = await db.query(sql);

    console.log("News fetched:", result.length, "items");

    const formatted = result.map(row => ({
      ...row,
      likes: 0,
      comments: [],
      reactions: {}
    }));

    res.json(formatted);

  } catch (err) {
    console.log("SQL ERROR:", err);
    res.status(500).json(err);
  }
});


// =========================
// GET COMMENTS BY NEWS ID
// =========================
router.get("/news/:id/comments", async (req, res) => {
  try {
    const sql = `
        SELECT 
            news_comments.*, 
            users.name AS user
        FROM news_comments
        LEFT JOIN users ON users.id = news_comments.user_id
        WHERE news_id = ?
        ORDER BY created_at ASC
    `;

    const [result] = await db.query(sql, [req.params.id]);
    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});


// =========================
// ADD COMMENT
// =========================
router.post("/news/:id/comments", async (req, res) => {
  try {
    const { user_id, comment } = req.body;

    const sql = `
        INSERT INTO news_comments (news_id, user_id, comment)
        VALUES (?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      req.params.id,
      user_id,
      comment
    ]);

    res.json({
      success: true,
      id: result.insertId,
      news_id: req.params.id,
      user_id,
      comment
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


// =========================
// DELETE COMMENT
// =========================
router.delete("/news/comments/:id", async (req, res) => {
  try {
    const sql = `DELETE FROM news_comments WHERE id = ?`;

    await db.query(sql, [req.params.id]);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json(err);
  }
});


// =========================
// LIKE / UNLIKE COMMENT
// =========================
router.post("/news/comments/:id/like", async (req, res) => {
  try {
    const { user_id, like } = req.body;

    if (!user_id) return res.status(400).json({ error: "Missing user_id" });

    if (like) {
      const sql = `
            INSERT IGNORE INTO news_comment_likes (comment_id, user_id)
            VALUES (?, ?)
        `;
      await db.query(sql, [req.params.id, user_id]);

      res.json({ success: true, liked: true });

    } else {
      const sql = `
            DELETE FROM news_comment_likes
            WHERE comment_id = ? AND user_id = ?
        `;
      await db.query(sql, [req.params.id, user_id]);

      res.json({ success: true, liked: false });
    }

  } catch (err) {
    res.status(500).json(err);
  }
});


// =========================
// GET LIKE COUNT PER COMMENT
// =========================
router.get("/news/comments/:id/likes", async (req, res) => {
  try {
    const sql = `
        SELECT COUNT(*) AS likes 
        FROM news_comment_likes 
        WHERE comment_id = ?
    `;

    const [result] = await db.query(sql, [req.params.id]);

    res.json(result[0]);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
