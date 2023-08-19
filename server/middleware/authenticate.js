const jwt = require("jsonwebtoken");
const User = require("../model/UserSchema");
const cookieParser = require("cookie-parser");

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.jwtoken;
    const verfiyToken = jwt.verify(token, process.env.SECRET_KEY);

    const rootUser = await User.findOne({
      _id: verfiyToken._id,
      "tokens.token": token,
    });

    if (!rootUser) {
      throw new Error("User not Found");
    }
    res.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;

    // Call next() to proceed to the next middleware function
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      console.log("Invalid JWT token:", error.message);
    } else if (error.name === "TokenExpiredError") {
      console.log("Expired JWT token:", error.message);
    } else {
      console.log("JWT error:", error.message);
    }
    res.status(401).json({ error: "Unauthorized access" });
  }
};

module.exports = authenticate;
