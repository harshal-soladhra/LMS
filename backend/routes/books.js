const express = require("express");
const router = express.Router();
const pool = require("../db"); // MySQL Connection Pool

// GET Books with Pagination, Search, and Filters
router.get("/", async (req, res) => {
    try {
        let { search, category, language, page, limit } = req.query;

        // Default pagination values
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 6;
        const offset = (page - 1) * limit;

        // Base SQL query
        let query = "SELECT * FROM books WHERE 1=1";
        let queryParams = [];

        // Search by Title
        if (search) {
            query += " AND title LIKE ?";
            queryParams.push(`%${search}%`);
        }

        // Filter by Category (supports multiple selections)
        if (category) {
            const categories = category.split(",");
            const categoryPlaceholders = categories.map(() => "?").join(",");
            query += ` AND category IN (${categoryPlaceholders})`;
            queryParams.push(...categories);
        }

        // Filter by Language (supports multiple selections)
        if (language) {
            const languages = language.split(",");
            const languagePlaceholders = languages.map(() => "?").join(",");
            query += ` AND language IN (${languagePlaceholders})`;
            queryParams.push(...languages);
        }

        // Add Sorting and Pagination
        query += " ORDER BY book_id ASC LIMIT ? OFFSET ?";
        queryParams.push(limit, offset);

        // Execute Query
        const [books] = await pool.execute(query, queryParams);
        res.json({ books, page, limit });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
