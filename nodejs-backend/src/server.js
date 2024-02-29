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
const blogService = require("./blog-service");
const imageService = require("./image-service");
const mongooseInit = require("./mongoose-init");
// Safety
require("dotenv").config();
// Core
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
const HTTPS_PORT = process.env.PORT || 8443;

/* --- --- --- --- MIDDLEWARE --- --- --- --- */

app.use(express.static("public"));
app.use(express.json()); // For parsing application/json
app.use(cookieParser()); // For handling cookies
app.use(express.urlencoded({ extended: true })); // req.body when using POST requests with form data (x-www-form-urlencoded)

/* --- --- --- --- COOKIES --- --- --- --- */

app.use(
  clientSessions({
    cookieName: "session",
    secret: process.env.SESSION_SECRET,
    duration: 10 * 60 * 1000,
    activeDuration: 1000 * 60 * 5,
  }),
);

app.use(
  clientSessions({
    cookieName: "theme_session",
    secret: process.env.SESSION_SECRET,
    duration: 30 * 60 * 60 * 1000,
    activeDuration: 60 * 60 * 1000,
  }),
);

function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
}

app.post("/set-theme", (req, res) => {
  const { theme } = req.body;
  req.theme_session.theme = theme;
  res.status(200).send("Theme updated");
});

/* --- --- --- --- MULTER & CLOUDINARY --- --- --- --- */

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const upload = multer({ storage: multer.memoryStorage() });

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      },
    );

    stream.end(fileBuffer);
  });
};

const cloudinaryUploadMiddleware = async (req, res, next) => {
  try {
    const uploaded = await uploadToCloudinary(req.file.buffer);
    req.cloudinaryResult = uploaded; // Attach the result to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Upload failed", error);
    res.status(500).send("An error occurred during file upload.");
  }
};

/* --- --- --- --- ENGINE --- --- --- --- */

app.set("view engine", "ejs");

/* --- --- --- --- GET VIEWS --- --- --- --- */

app.get("/", (req, res) => {
  res.redirect("/homepage");
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
  (async () => {
    try {
      const user = await authService.getUserByUsername(
        req.session.user.username,
      );
      const userId = user._id; // Make sure `user` is not undefined before accessing `_id`
      const images = await imageService.getImagesByUser(userId);

      const itemsPerPage = 15;
      let page = req.query.page ? parseInt(req.query.page) : 1; // Default to page 1 if not provided
      const offset = (page - 1) * itemsPerPage;

      const paginatedItems = images.slice(offset, offset + itemsPerPage);
      const totalPages = Math.ceil(images.length / itemsPerPage);

      res.render("dashboard", {
        title: "Dashboard",
        user: req.session.user,
        cards: paginatedItems,
        currentPage: page,
        totalPages: totalPages,
        cQuery: req.query.q,
      });
    } catch (error) {
      console.error("Error fetching dashboard data", error);
      res.status(500).send("An error occurred.");
    }
  })();
});

app.get("/image/upload", ensureLogin, (req, res) => {
  res.render("image-upload", { title: "Image Upload", user: req.session.user });
});

app.post("/image/editor", ensureLogin, (req, res) => {
  (async () => {
    try {
      const image = await imageService.getImageById(req.body.imageId);
      res.render("image-editor", {
        title: "Image Editor",
        user: req.session.user,
        image: image,
      });
    } catch (error) {
      console.error("Error fetching image", error);
      res.status(500).send("An error occurred.");
    }
  })();
});

app.post("/profile/update", ensureLogin, (req, res) => {
  res.render("profile-form", {
    title: "Profile Update",
    user: req.session.user,
  });
});

app.get("/logout", ensureLogin, function (req, res) {
  // Destroy the session
  res.session = null;
  res.clearCookie("session");
  res.redirect("/homepage");
});

/* --- --- --- --- GET RESPONSES --- --- --- --- */

app.get("/get-theme", (req, res) => {
  const theme = req.theme_session.theme || "light"; // Default to light theme if not set
  res.json({ theme });
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
    user: req.session.user,
  });
});

app.get("/blog", ensureLogin, (req, res) => {
  res.send("blog page");
});

app.get("/editor/post", ensureLogin, (req, res) => {
  res.send("editor post page");
});

app.get("/about%20us", (req, res) => {
  res.render("about-us", { title: "About Us" });
});

app.get("/terms%20of%20service", (req, res) => {
  res.send("terms of service page");
});

app.get("/privacy%20policy", (req, res) => {
  res.send("privacy policy page");
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

app.post("/login", async (req, res) => {
  req.body.userAgent = req.get("User-Agent");

  try {
    const user = await authService.checkUser(req.body);
    req.session.user = {
      username: user.username,
      profilePicture: user.profile.profilePicture || null,
    };

    res.redirect("/dashboard");
  } catch (err) {
    res.render("login", {
      title: "Login",
      user: req.session.user,
      errorMessage: err,
      username: req.body.username,
    });
  }
});

app.post("/register", async (req, res) => {
  try {
    await authService.registerUser(req.body);
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
  } catch (err) {
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
  }
});

app.post(
  "/image/upload",
  upload.single("imageUpload"),
  cloudinaryUploadMiddleware,
  async (req, res) => {
    try {
      const uploaded = req.cloudinaryResult;
      req.body.storagePath = uploaded.url;
      req.body.format = req.file.mimetype.split("/").pop();
      req.body.creator = req.session.user.username;
      req.body.tags = req.body.tags ? req.body.tags.split(",") : [];
      delete req.body.imageUpload;

      const user = await authService.getUserByUsername(
        req.session.user.username,
      );
      req.body.userId = user._id;

      await imageService.addImage(req.body);
      res.redirect("/dashboard");
    } catch (error) {
      console.error("Error adding image", error);
      res.status(500).send("An error occurred.");
    }
  },
);

app.post(
  "/profile/update",
  upload.single("profilePicture"),
  cloudinaryUploadMiddleware,
  (req, res) => {
    (async () => {
      try {
        const uploaded = req.cloudinaryResult;
        req.body.profilePicture = uploaded.url;

        await authService.updateUserProfile(
          req.session.user.username,
          req.body,
        );
        req.session.user.profilePicture = uploaded.url;
        res.redirect("/dashboard");
      } catch (error) {
        console.error("Error updating profile", error);
        res.status(500).send("An error occurred during profile update.");
      }
    })();
  },
);

app.post("/delete/images", (req, res) => {
  (async () => {
    try {
      await imageService.deleteImages(req.body.ids);
      res.redirect("/dashboard");
    } catch (error) {
      console.error("Error deleting images", error);
      res.status(500).send("An error occurred during image deletion.");
    }
  })();
});

app.post("/blog/publish", (req, res) => {
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
