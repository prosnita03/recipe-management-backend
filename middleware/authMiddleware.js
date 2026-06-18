const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    let token;

    // Check if authorization header exists and starts with Bearer
    if (
      req.header("Authorization") &&
      req.header("Authorization").startsWith("Bearer")
    ) {
      token = req.header("Authorization").split(" ")[1];
    } else {
      // Fallback for simple Authorization header without Bearer
      token = req.header("Authorization");
    }

    if (!token) {
      return res.status(401).json({
        message: "Not authorized to access this route. Please login first.",
      });
    }

    const decoded = jwt.verify(token, "mykeypswrd");

    // Add the decoded user payload to the request object
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err.message);
    return res.status(401).json({
      message: "Token is invalid or expired.",
    });
  }
};

module.exports = auth;