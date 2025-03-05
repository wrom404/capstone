import jwt from "jsonwebtoken";

function generateToken(userId, userRole, res) {
  const SECRET_KEY = process.env.SECRET_KEY;

  const token = jwt.sign({ userId, userRole }, SECRET_KEY, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "strict",
  });

  console.log(`Token: ${token}`);

  return token;
}

export default generateToken;
