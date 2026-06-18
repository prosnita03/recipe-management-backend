const express = require("express");
const app = express();
const connectdb = require("./config/db");
const recipeRoute = require("./router/recipeRoute");
const authRoute = require("./router/authRouter");

// Middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectdb();

// Routes
app.use("/api/v1/recipes", recipeRoute);
app.use("/auth", authRoute);

// Base route for health check
app.get("/", (req, res) => {
  res.send("Recipe Management API is running!");
});

// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});