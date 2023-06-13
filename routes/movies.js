const express = require("express");
const fetchUser = require("../middleware/fetchuser");
const router = express.Router();
const Movies = require("../models/Movies");
const { body, validationResult } = require("express-validator");

// Routes1: get all the movies
router.get("/fetchallmovies", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Get the page number from query parameters, default to 1 if not provided
  const pageSize = parseInt(req.query.pageSize) || 15; // Get the page size from query parameters, default to 10 if not provided
  const age = parseInt(req.query.age) || 17; // Get the age from query parameters, default to 0 if not provided
  const type = req.query.type || "";
  const search = req.query.search || ""; // Assuming the search word is passed as a query parameter

  // Calculate the skip value to determine the starting point for data retrieval
  const skip = (page - 1) * pageSize;

  // Define the filter based on the age condition
  const filter = {
    ...(age < 18 ? { rating: { $ne: "R" } } : {}),
    type: type === "TV Show" ? "TV Show" : "Movie",
    $or: [
      { title: { $regex: search, $options: "i" } }, // Case-insensitive search by title
      { cast: { $regex: search, $options: "i" } }, // Case-insensitive search by cast
    ],
  };

  // Retrieve limited documents from the MongoDB collection with pagination
  Movies.find(filter)
    .skip(skip)
    .limit(pageSize)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.error("Failed to get data from MongoDB:", err);
      res.status(500).json({ error: "Failed to get data" });
    });
});

module.exports = router;
