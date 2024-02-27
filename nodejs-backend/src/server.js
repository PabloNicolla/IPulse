const allCards = [
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
// test

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
// Core
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
const HTTPS_PORT = process.env.PORT || 8443;

/* --- --- --- --- MIDDLEWARE --- --- --- --- */

app.use(express.static("public"));
app.use(express.json()); // For parsing application/json
app.use(cookieParser()); // For handling cookies
app.use(express.urlencoded({ extended: true })); // req.body when using POST requests with form data (x-www-form-urlencoded)

/* --- Cookies --- */

app.use(
  clientSessions({
    cookieName: "session",
    secret: "o6LjQ5EVNC28ZgK64hDELM18ScpFQr",
    duration: 2 * 60 * 1000,
    activeDuration: 1000 * 60,
  }),
);

app.use(function (req, res, next) {
  res.locals.session = req.session;
  if (!req.session.user) {
    res.locals.user = null;
  } else {
    res.locals.user = req.session.user;
  }
  next();
});

function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
}

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

  res.render("homepage", {
    title: "Home Page",
    cards: limitedCards,
    user: res.locals.user,
  });
});

app.get("/login", (req, res) => {
  if (req.session.user) {
    res.redirect("/dashboard");
  }
  res.render("login", {
    title: "Login",
    user: req.session.user,
    errorMessage: "",
    username: "",
  });
});

app.get("/register", (req, res) => {
  if (req.session.user) {
    res.redirect("/dashboard");
  }
  res.render("register", {
    title: "Register",
    user: req.session.user,
    message: { type: "", text: "", username: "", email: "" },
  });
});

app.get("/dashboard", ensureLogin, (req, res) => {
  res.send("dashboard page");
});

app.get("/editor/image", ensureLogin, (req, res) => {
  res.send("editor image page");
});

app.get("/blog", ensureLogin, (req, res) => {
  res.send("blog page");
});

app.get("/editor/post", ensureLogin, (req, res) => {
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

app.get("/profile", (req, res) => {
  res.send("privacy policy page");
});

app.get("/logout", function (req, res) {
  // Destroy the session
  res.session = null;
  res.clearCookie("session");
  res.redirect("/homepage");
});

/* --- --- --- --- GET search --- --- --- --- */

app.get("/search", (req, res) => {
  const itemsPerPage = 3;
  let page = req.query.page ? parseInt(req.query.page) : 1; // Default to page 1 if not provided
  const offset = (page - 1) * itemsPerPage;

  // Assuming `allCards` is an array containing all your card data
  const paginatedItems = allCards.slice(offset, offset + itemsPerPage);

  // Calculate the total number of pages
  const totalPages = Math.ceil(allCards.length / itemsPerPage);

  res.render("search", {
    title: "Search",
    user: req.session.user,
    cards: paginatedItems,
    currentPage: page,
    totalPages: totalPages,
    cQuery: req.query.q,
  });
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
  req.body.userAgent = req.get("User-Agent");

  authService
    .checkUser(req.body)
    .then((user) => {
      req.session.user = {
        username: user.username,
        email: user.email,
        loginHistory: user.loginHistory,
      };

      res.redirect("/dashboard");
    })
    .catch((err) => {
      res.render("login", {
        title: "Login",
        user: req.session.user,
        errorMessage: err,
        username: req.body.username,
      });
    });
});

app.post("/register", (req, res) => {
  authService
    .registerUser(req.body)
    .then(() => {
      res.render("register", {
        title: "Register",
        user: req.session.user,
        message: {
          type: "success",
          text: "User created",
          username: "",
          email: "",
        },
      });
    })
    .catch((err) => {
      res.render("register", {
        title: "Register",
        user: req.session.user,
        message: {
          type: "failure",
          text: `${err}`,
          username: req.body.username,
          email: req.body.email,
        },
      });
    });
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
