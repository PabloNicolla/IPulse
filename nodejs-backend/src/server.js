// Core
const express = require("express");
const path = require("path");
const fs = require("fs");
const ejs = require("ejs");
// Local
const mongooseInit = require("./mongoose-init");
const authService = require("./auth-service");
const imageService = require("./image-service");
const blogService = require("./blog-service");
// Safety
const { HTTPS_PORT, HTTP_PORT } = require("./config/index");
require("dotenv").config();
// Core
const app = express();

/* --- --- --- --- MIDDLEWARE & COOKIES --- --- --- --- */

const commonMiddleware = require("./middleware/commonMiddleware");
commonMiddleware(app);

/* --- --- --- --- ENGINE --- --- --- --- */

app.set("view engine", "ejs");

/* --- --- --- --- GET VIEWS --- --- --- --- */

const publicRoutes = require("./routes/public");
const userRoutes = require("./routes/users");
const imageRoutes = require("./routes/images");

app.use("/", publicRoutes);
app.use("/users", userRoutes);
app.use("/image", imageRoutes);

/* --- --- --- --- --- --- --- -- --- --- --- -- --- --- --- -- --- --- --- -- --- --- --- -- --- --- --- -- */

function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect("/users/login");
  } else {
    next();
  }
}

app.get("/blog", ensureLogin, (req, res) => {
  // TODO
  res.send("blog page");
});

app.get("/editor/post", ensureLogin, (req, res) => {
  // TODO
  res.send("editor post page");
});

app.post("/blog/publish", (req, res) => {
  // TODO
  console.log(req.body);
  res.send("Blog post published");
});

/* --- --- --- --- 404 --- --- --- --- */

app.use((req, res, next) => {
  res.render("404", { title: "404" });
});

/* --- --- --- --- Server Start --- --- --- --- */

(async () => {
  try {
    await mongooseInit.initialize();
    await authService.initialize();
    await imageService.initialize();
    app.listen(HTTP_PORT, () => {
      console.log(`Example app listening at http://localhost:${HTTP_PORT}`);
    });
  } catch (error) {
    console.error("Error starting server", error);
  }
})();
