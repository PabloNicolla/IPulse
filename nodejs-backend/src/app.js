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
const port = 8080;

/* --- --- --- --- MIDDLEWARE --- --- --- --- */
/* --- Cookies --- */
/* --- --- --- --- MULTER & CLOUDINARY --- --- --- --- */
/* --- --- --- --- ENGINE --- --- --- --- */
/* --- --- --- --- GET --- --- --- --- */

app.get("/", (req, res) => {
  res.redirect("/homepage");
});

app.get("/homepage", (req, res) => {
  res.send("Hello World");
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
  res.send("about us page");
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
