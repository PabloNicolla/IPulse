// Core
const express = require("express");
const path = require("path");
// Image Upload
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
// Session
const clientSessions = require("client-sessions");
const cookieParser = require("cookie-parser");
// View
const ejs = require("ejs");
// Local
const authService = require("./auth-service");

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

/* --- --- --- --- MIDDLEWARE --- --- --- --- */

app.use(express.static("public"));
app.use(express.json()); // For parsing application/json
app.use(cookieParser()); // For handling cookies

/* --- Cookies --- */

app.use((req, res, next) => {
  if (!req.headers.cookie) {
    // Assign a random user ID as a cookie if it doesn't exist
    const userId = Math.floor(Math.random() * 10000); // Simple random user ID generator
    res.cookie("userID", userId, {
      maxAge: 900000,
      httpOnly: true,
      SameSite: "Strict",
    });
    console.log(`Set new user ID: ${userId}`);
  } else {
    // Log the user ID from the cookie
    const cookieString = req.headers.cookie;
    const userId = cookieString
      .split("; ")
      .find((row) => row.startsWith("userID="))
      .split("=")[1];
    console.log(`Existing user ID: ${userId}`);
  }
  next();
});

app.post("/set-theme", (req, res) => {
  const { theme } = req.body;
  // Set a cookie with the theme choice, with a max age of 30 days
  res.cookie("theme", theme, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });
  res.status(200).send("Theme updated");
});

/* --- --- --- --- MULTER & CLOUDINARY --- --- --- --- */
/* --- --- --- --- ENGINE --- --- --- --- */

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true })); // req.body when using POST requests with form data (x-www-form-urlencoded)

/* --- --- --- --- GET --- --- --- --- */

app.get("/", (req, res) => {
  res.redirect("/homepage");
});

app.get("/homepage", (req, res) => {
  // Example array of card objects
  const cards = [
    {
      imgSrc:
        "https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg",
      title: "Title 1",
      description: "Description 1",
      badges: ["Fashion", "Products"],
    },
    {
      imgSrc:
        "https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg",
      title: "Title 1",
      description: "Description 1",
      badges: ["Fashion", "Products"],
    },
    {
      imgSrc:
        "https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg",
      title: "Title 1",
      description: "Description 1",
      badges: ["Fashion", "Products"],
    },
    // Add up to 12 card objects
  ];

  // Limit the array to a maximum of 12 items
  const limitedCards = cards.slice(0, 12);

  const user = { loggedIn: false, username: "JohnDoe" };

  res.render("homepage", {
    title: "Home Page",
    cards: limitedCards,
    user: user,
  }); // Assuming your EJS file is named 'homepage.ejs'
});

app.get("/login", (req, res) => {
  const user = { loggedIn: false, username: "JohnDoe" };
  res.render("login", { title: "Login", user: user });
});

app.get("/register", (req, res) => {
  const user = { loggedIn: false, username: "JohnDoe" };
  res.render("register", { title: "Register", user: user });
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

app.get("/about%20us", (req, res) => {
  res.render("about_us", { title: "About Us" });
});

app.get("/terms%20of%20service", (req, res) => {
  res.send("terms of service page");
});

app.get("/privacy%20policy", (req, res) => {
  res.send("privacy policy page");
});

/* --- --- --- --- GET search --- --- --- --- */

app.get("/search", (req, res) => {
  res.send("search page");
});

app.get("/search/recommendations", (req, res) => {
  const query = req.query.q;
  // Implement logic to find recommendations based on the query
  // This is just a placeholder response
  const recommendations = ["Suggestion 1", "Suggestion 2", "Suggestion 3"];
  res.json(recommendations);
});

/* --- --- --- --- POST --- --- --- --- */

app.post("/login", (req, res) => {
  res.send("login page");
});

app.post("/register", (req, res) => {
  res.send("register page");
});

/* --- --- --- --- 404 --- --- --- --- */
/* --- --- --- --- Server Start --- --- --- --- */

authService.initialize().then(() => {
  app.listen(HTTP_PORT, () => {
    console.log(`Example app listening at http://localhost:${HTTP_PORT}`);
  });
});

// app.listen(HTTP_PORT, () => {
//   console.log(`Example app listening at http://localhost:${HTTP_PORT}`);
// });
