const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const booksRoutes = require("./routes/books"); // Ensure this path is correct
app.use("/api/books", booksRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack); // Logs error details
    res.status(500).json({ error: err.message || "Internal Server Error" });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
