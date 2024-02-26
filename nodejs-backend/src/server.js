// Core
const express = require("express");
const path = require("path");
// Image Upload
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
// Session
const clientSessions = require("client-sessions");
// View
const ejs = require("ejs");

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

/* --- --- --- --- MIDDLEWARE --- --- --- --- */

app.use(express.static("public"));

/* --- Cookies --- */
/* --- --- --- --- MULTER & CLOUDINARY --- --- --- --- */
/* --- --- --- --- ENGINE --- --- --- --- */

app.set("view engine", "ejs");

/* --- --- --- --- GET --- --- --- --- */

app.get("/", (req, res) => {
  res.redirect("/homepage");
});

app.get("/homepage", (req, res) => {
  res.render("homepage", { title: "Home Page" });
});

app.get("/login", (req, res) => {
  res.send("login page");
});

app.get("/register", (req, res) => {
  res.send("register page");
});

app.get("/dashboard", (req, res) => {
  res.send("dashboard page");
});

app.get("/editor/image", (req, res) => {
  res.send("editor image page");
});

app.get("/blog", (req, res) => {
  res.send("blog page");
});

app.get("/editor/post", (req, res) => {
  res.send("editor post page");
});

app.get("/search", (req, res) => {
  res.send("search page");
});

app.get("/about%20us", (req, res) => {
  res.render("about_us", { title: "About Us" });
});

app.get("/terms%20of%20service", (req, res) => {
  res.send("terms of service page");
});

app.get("/privacy%20policy", (req, res) => {
  res.send("privacy policy page");
});

/* --- --- --- --- POST --- --- --- --- */
/* --- --- --- --- 404 --- --- --- --- */
/* --- --- --- --- Server Start --- --- --- --- */

app.listen(HTTP_PORT, () => {
  console.log(`Example app listening at http://localhost:${HTTP_PORT}`);
});
