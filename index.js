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

// initial setup db
const {
  createUsers,
  createCategories,
  createRoles,
  removeUsers,
} = require("./initialSetup/index");

createRoles();
createUsers([
  {
    name: "test",
    lastname: "test",
    email: "test",
    username: "test",
    password: "test",
    roles: ["admin", "user"],
  },
]);
createCategories([{ name: "programming" }, { name: "application web" }]);
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
const roleRouter = require("./routes/Role");
app.use("/role", roleRouter);

app.use(logErrors);
app.use(errorHandler);
app.use(boomErrorHandler);

app.listen(PORT, () => {
  console.log("SERVER RUNNING IN PORT", PORT);
});
