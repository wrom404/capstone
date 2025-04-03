import pool from "../config/db.js";
import comparePassword from "../utils/comparePassword.js";
import generateToken from "../utils/generateToken.js";
import hashPassword from "../utils/hashPassword.js";
import checkEmail from "../utils/testEmail.js";
import jwt from "jsonwebtoken";

export async function signupUser(req, res) {
  const { firstName, lastName, email, password } = req.body;

  console.log(firstName);
  console.log(lastName);
  console.log(email);
  console.log(password);

  if (!firstName || !lastName || !email || !password) {
    return res
      .status(401)
      .json({ success: false, message: "All fields are required" });
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

    const token = generateToken(user.rows[0].id, user.rows[0].role, res);

    console.log("success");
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.rows[0].id,
        email: user.rows[0].email,
        role: user.rows[0].role,
      },
      message: "Login successfully",
    });
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
  res.clearCookie("token");
  return res
    .status(200)
    .json({ success: true, message: "Logout successfully" });
}

export async function getUsers(req, res) {
  try {
    const users = await pool.query("SELECT * FROM users ORDER BY id ASC");

    if (users.rows.length === 0) {
      return res.status(201).json({ success: false, message: "No users" });
    }

    return res.status(200).json({ success: true, users: users.rows });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error });
  }
}

export async function deleteUser(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "ID parameter is missing",
    });
  }

  console.log(`ID received: ${id}`);

  try {
    // Check if the user exists
    const eventCheck = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);

    if (eventCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete the user
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length > 0) {
      return res
        .status(200)
        .json({ success: true, message: "User deleted successfully" });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to delete user",
      });
    }
  } catch (error) {
    console.error("Error deleting event:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the event",
      error: error.message,
    });
  }
}
