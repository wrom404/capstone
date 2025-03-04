import bcrypt from "bcrypt";

async function comparePassword(password, hashedPassword) {
  try {
    const result = await bcrypt.compare(password, hashedPassword);
    return result;
  } catch (error) {
    console.log("Error: ", error.message);
  }
}
export default comparePassword;
