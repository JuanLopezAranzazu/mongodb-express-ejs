const { config } = require("dotenv");
config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/db-mongo-ejs";
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "SECRET_KEY";

module.exports = { MONGODB_URI, PORT, JWT_SECRET };
