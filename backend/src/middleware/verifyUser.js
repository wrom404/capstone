import jwt from "jsonwebtoken";

function verifyUser(req, res, next) {
  const SECRET_KEY = process.env.SECRET_KEY;
  const { token } = req.cookies;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized user" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    if (!decoded) {
      throw jwt.TokenExpiredError;
    }

    req.id = decoded.userId;
    next();
  } catch (error) {
    console.log("Error:", error.message);

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    return res.status(401).json({ success: false, error: error.message });
  }
}

export default verifyUser;
