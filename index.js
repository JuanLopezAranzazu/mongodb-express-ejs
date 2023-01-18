const express = require("express");
const app = express();
const path = require("path");
// template ejs
require("ejs");
// connection db
require("./database");
// middlewares
const {
  logErrors,
  errorHandler,
  boomErrorHandler,
} = require("./middlewares/error");

const { PORT } = require("./config");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// initial db
const User = require("./models/User");
const Category = require("./models/Category");
const { hash } = require("argon2");

const createUsers = async (entryUsers) => {
  try {
    // Count Documents
    const count = await User.estimatedDocumentCount();

    // check for existing users
    if (count > 0) return;

    User.insertMany(entryUsers, (err, result) => {
      if (err) {
        throw new Error(err);
      }
      console.log(result);
    });
  } catch (error) {
    console.error(error.message);
  }
};

const createCategories = async (entryCategories) => {
  try {
    // Count Documents
    const count = await Category.estimatedDocumentCount();

    // check for existing category
    if (count > 0) return;

    Category.insertMany(entryCategories, (err, result) => {
      if (err) {
        throw new Error(err);
      }
      console.log(result);
    });
  } catch (error) {
    console.error(error.message);
  }
};

createUsers([
  {
    name: "test",
    lastname: "test",
    email: "test",
    username: "test",
    password: "test",
  },
]);
createCategories([{ name: "programming" }, { name: "application web" }]);

// remove data db
const removeUsers = () => {
  try {
    User.deleteMany({}, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Documents removed");
      }
    });
  } catch (error) {
    console.error(error.message);
  }
};

// removeUsers();

// routes
const authRouter = require("./routes/Auth");
app.use("/auth", authRouter);
const userRouter = require("./routes/User");
app.use("/user", userRouter);
const publicationRouter = require("./routes/Publication");
app.use("/publication", publicationRouter);
const categoryRouter = require("./routes/Category");
app.use("/category", categoryRouter);

app.use(logErrors);
app.use(errorHandler);
app.use(boomErrorHandler);

app.listen(PORT, () => {
  console.log("SERVER RUNNING IN PORT", PORT);
});
