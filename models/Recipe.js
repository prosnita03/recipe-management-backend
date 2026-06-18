const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Recipe title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    ingredients: {
      type: [String],
      required: [true, "At least one ingredient is required"],
    },
    instructions: {
      type: String,
      required: [true, "Instructions are required"],
    },
    imageUrl: {
      type: String,
      required: [true, "Recipe image URL is required"],
    },
    mealDbId: {
      type: String,
      default: null, 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recipe", recipeSchema);
