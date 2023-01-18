// models
const User = require("./../models/User");
const Category = require("./../models/Category");
const Role = require("./../models/Role");
const { hash } = require("argon2");

const createUsers = async (entryUsers) => {
  try {
    // Count Documents
    const count = await User.estimatedDocumentCount();

    // check for existing users
    if (count > 0) return;

    for (let i = 0; i < entryUsers.length; i++) {
      const { roles, password, ...rest } = entryUsers[i];
      const passwordHash = await hash(password);
      const newUser = new User({ ...rest, password: passwordHash });
      if (roles) {
        const rolesFound = await Role.find({ name: { $in: roles } });
        newUser.roles = rolesFound.map((role) => role._id);
      } else {
        const role = await Role.findOne({ name: "user" });
        newUser.roles = [role._id];
      }
      await newUser.save();
    }
    console.log("Users saved");
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

const createRoles = async () => {
  try {
    // Count Documents
    const count = await Role.estimatedDocumentCount();

    // check for existing roles
    if (count > 0) return;

    // Create default Roles
    const values = await Promise.all([
      new Role({ name: "admin" }).save(),
      new Role({ name: "user" }).save(),
    ]);

    console.log(values);
  } catch (error) {
    console.error(error);
  }
};

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

module.exports = { createUsers, createCategories, createRoles, removeUsers };
