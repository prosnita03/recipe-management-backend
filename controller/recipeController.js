const Recipe = require("../models/Recipe");
const cloudinary = require("../config/cloudinary");


exports.createRecipe = async (req, res) => {
  try {
    console.log("Req.body:", req.body);
    console.log("Req.file:", req.file);
    
    const { title, description, ingredients, instructions } = req.body || {};

    if (!title || !ingredients || !instructions) {
      return res.status(400).json({ 
        message: "Please provide title, ingredients, and instructions",
        receivedBody: req.body // Helps debug what Postman is actually sending
      });
    }

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "Image upload failed. Please provide a valid image." });
    }

    let parsedIngredients = ingredients;
    if (typeof ingredients === "string") {
      parsedIngredients = ingredients.split(",").map((i) => i.trim());
    }

    const recipe = await Recipe.create({
      user: req.user.id, 
      title,
      description,
      ingredients: parsedIngredients,
      instructions,
      imageUrl: req.file.path, 
    });

    return res.status(201).json({
      message: "Recipe created successfully",
      recipe,
    });
  } catch (error) {
    console.error("Error creating recipe:", error);
    return res.status(500).json({
      message: "An error occurred while creating the recipe",
      error: error.message,
    });
  }
};


exports.getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ user: req.user.id });
    return res.status(200).json({
      message: "Successfully retrieved your recipes",
      count: recipes.length,
      recipes,
    });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return res.status(500).json({
      message: "An error occurred while fetching your recipes",
      error: error.message,
    });
  }
};


exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found or unauthorized" });
    }

    return res.status(200).json({
      message: "Successfully retrieved recipe details",
      recipe,
    });
  } catch (error) {
    console.error("Error fetching recipe by ID:", error);
    return res.status(500).json({
      message: "An error occurred while fetching the recipe",
      error: error.message,
    });
  }
};

exports.updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found or unauthorized to update" });
    }

    return res.status(200).json({
      message: "Recipe updated successfully",
      recipe,
    });
  } catch (error) {
    console.error("Error updating recipe:", error);
    return res.status(500).json({
      message: "An error occurred while updating the recipe",
      error: error.message,
    });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found or unauthorized to delete" });
    }

    return res.status(200).json({
      message: "Recipe deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    return res.status(500).json({
      message: "An error occurred while deleting the recipe",
      error: error.message,
    });
  }
};


exports.searchMealDB = async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) {
      return res.status(400).json({ message: "Please provide a search query" });
    }

    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const data = await response.json();

    if (!data.meals) {
      return res.status(404).json({ message: "No recipes found matching your query." });
    }

    return res.status(200).json({
      message: "Recipes fetched from TheMealDB successfully",
      count: data.meals.length,
      recipes: data.meals,
    });
  } catch (error) {
    console.error("Error fetching from TheMealDB:", error);
    return res.status(500).json({
      message: "An error occurred while communicating with TheMealDB",
      error: error.message,
    });
  }
};

exports.saveFromMealDB = async (req, res) => {
  try {
    const { mealId } = req.body;
    if (!mealId) {
      return res.status(400).json({ message: "Please provide a valid mealId" });
    }

 
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    const data = await response.json();

    if (!data.meals) {
      return res.status(404).json({ message: "Recipe not found on TheMealDB" });
    }

    const mealData = data.meals[0];


    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = mealData[`strIngredient${i}`];
      const measure = mealData[`strMeasure${i}`];
      if (ingredient && ingredient.trim() !== "") {
        ingredients.push(`${measure} ${ingredient}`.trim());
      }
    }


    const recipe = await Recipe.create({
      user: req.user.id,
      title: mealData.strMeal,
      description: `${mealData.strArea} ${mealData.strCategory}`,
      ingredients: ingredients,
      instructions: mealData.strInstructions,
      imageUrl: mealData.strMealThumb, 
      mealDbId: mealData.idMeal,
    });

    return res.status(201).json({
      message: "Recipe imported from TheMealDB successfully",
      recipe,
    });
  } catch (error) {
    console.error("Error saving from TheMealDB:", error);
    return res.status(500).json({
      message: "An error occurred while importing the recipe",
      error: error.message,
    });
  }
};
