import pool from "../config/db.js";
import comparePassword from "../utils/comparePassword.js";
import generateToken from "../utils/generateToken.js";
import hashPassword from "../utils/hashPassword.js";
import checkEmail from "../utils/testEmail.js";
import jwt from "jsonwebtoken";

export async function signupUser(req, res) {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    return res
      .status(401)
      .json({ success: false, message: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res
      .status(401)
      .json({ success: false, message: "Password did not match" });
  }

  const isEmailValid = checkEmail(email);
  if (!isEmailValid) {
    return res.status(401).json({ success: false, message: "Invalid email" });
  }

  const hashedPassword = await hashPassword(password);
  if (!hashedPassword) {
    return res
      .status(401)
      .json({ success: false, message: "Password invalid" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO users (first_name, last_name, email, password) VALUES($1, $2, $3, $4) RETURNING *",
      [firstName, lastName, email, hashedPassword]
    );

    return res.status(201).json({
      success: true,
      data: result.rows[0],
      message: "Sign up successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to sign-up",
      error: error.message,
    });
  }
}

export async function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(401)
      .json({ success: false, error: "All fields are required" });
  }

  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json({ success: false, error: "Incorrect email" });
    }

    const isPasswordCorrect = await comparePassword(
      password,
      user.rows[0].password
    );

    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ success: false, error: "Incorrect password" });
    }

    generateToken(user.rows[0].id, user.rows[0].role, res);

    return res
      .status(200)
      .json({ success: false, message: "Login successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to login",
      error: error.message,
    });
  }
}

export async function currentUser(req, res) {
  const { token } = req.cookies;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized user" });
  }

  try {
    const decoded = jwt.decode(token, process.env.SECRET_KEY);
    const userId = decoded.userId;

    const result = await pool.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "No user found" });
    }

    return res
      .status(200)
      .json({ success: true, user: { ...result.rows[0], password: "" } });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error });
  }
}

export async function logoutUser(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "strict",
  });
  return res.status(200).json({ message: "Logout successfully" });
}
