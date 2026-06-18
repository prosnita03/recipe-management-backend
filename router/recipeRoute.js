const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const cloudinary = require("../config/cloudinary");
const auth = require("../middleware/authMiddleware");
const {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  searchMealDB,
  saveFromMealDB,
} = require("../controller/recipeController");

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "recipes",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage: storage });

// =====================================
// TheMealDB API Routes (External)
// =====================================
router.get("/external/search", searchMealDB);
router.post("/external/save", auth, saveFromMealDB);

// =====================================
// Local Recipe CRUD Routes
// =====================================
router.post("/", auth, upload.single("image"), createRecipe);
router.get("/", auth, getRecipes);
router.get("/:id", auth, getRecipeById);
router.put("/:id", auth, updateRecipe);
router.delete("/:id", auth, deleteRecipe);

module.exports = router;
