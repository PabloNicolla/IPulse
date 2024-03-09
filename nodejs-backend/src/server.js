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
const fs = require("fs");
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
// Image Editor
const axios = require("axios");
const FormData = require("form-data");
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
    duration: 30 * 60 * 1000,
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

app.use(
  clientSessions({
    cookieName: "imageEditor",
    secret: process.env.SESSION_SECRET,
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
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

app.get("/image/editor", ensureLogin, (req, res) => {
  res.render("image-editor", {
    title: "Image Editor",
    user: req.session.user,
    image: req.imageEditor.image,
  });
});

app.get("/profile/update", ensureLogin, (req, res) => {
  res.render("profile-form", {
    title: "Profile Update",
    user: req.session.user,
  });
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

// app.get("/blog", ensureLogin, (req, res) => { ---------------------------------------------------------------------
//   res.send("blog page");
// });

app.get("/editor/post", ensureLogin, (req, res) => {
  res.send("editor post page");
});

app.get("/about%20us", (req, res) => {
  res.render("about-us", { title: "About Us", user: req.session.user });
});

app.get("/terms%20of%20service", (req, res) => {
  res.render("terms-of-service", {
    title: "Terms of Service",
    user: req.session.user,
  });
});

app.get("/privacy%20policy", (req, res) => {
  res.render("privacy-policy", {
    title: "Privacy Policy",
    user: req.session.user,
  });
});

app.get("/support", (req, res) => {
  res.render("support", { title: "Support", user: req.session.user });
});

/* --- --- --- --- GET RESPONSES --- --- --- --- */

app.get("/logout", ensureLogin, function (req, res) {
  // Destroy the session
  res.session = null;
  res.clearCookie("session");
  res.redirect("/homepage");
});

app.get("/get-theme", (req, res) => {
  const theme = req.theme_session.theme || "light"; // Default to light theme if not set
  res.json({ theme });
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

app.get("/blog", (req, res) => {
  res.render("blog", { title: "Blog", user: req.session.user });
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
      req.body.tags = req.body.tags
        ? req.body.tags.split(",").map((tag) => tag.trim())
        : [];
      req.body.cloudinaryId = uploaded.public_id;
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

app.post("/image/editor", ensureLogin, (req, res) => {
  (async () => {
    try {
      const image = await imageService.getImageById(req.body.image_id);
      req.imageEditor.image = image;
      res.redirect("/image/editor");
    } catch (error) {
      console.error("Error fetching image", error);
      res.status(500).send("An error occurred.");
    }
  })();
});

app.post(
  "/image/editor/upload",
  upload.single("imageFile"),
  async (req, res) => {
    try {
      let uploadResult;

      if (req.file) {
        // New image uploaded: upload its buffer to Cloudinary
        const fileBuffer = req.file.buffer; // Assuming multer is configured to use memory storage
        uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ resource_type: "auto" }, (error, result) => {
              if (error) reject(error);
              else resolve(result);
            })
            .end(fileBuffer);
        });
      } else {
        // No new image uploaded: duplicate the original image on Cloudinary
        const originalImageURL = req.imageEditor.image.storagePath; // Ensure this is the full URL of the image
        uploadResult = await cloudinary.uploader.upload(originalImageURL, {
          resource_type: "image",
          // Optionally, you can specify a new public_id here
          // If you don't specify a public_id, Cloudinary will generate a new one
        });
      }

      console.log("Image processed successfully", uploadResult);

      const newImage = {
        imageTitle: req.body.imageTitle,
        description: req.body.description,
        tags: req.body.tags.split(",").map((tag) => tag.trim()) || [],
        creator: req.session.user.username,
        storagePath: uploadResult.url,
        format: uploadResult.format,
        userId: req.imageEditor.image.userId, // Assuming you want to keep the same userId
        cloudinaryId: uploadResult.public_id, // The new Cloudinary ID
      };

      await imageService.addImage(newImage); // Add the new image data to your database
      res.redirect("/dashboard");
    } catch (error) {
      console.error("Error processing image", error);
      res.status(500).send("An error occurred.");
    }
  },
);

// app.post("/image/editor/upload", (req, res) => {
//   (async () => {
//     try {
//       const originalImage = await imageService.getImageById(req.body.image_id);
//       req.body.tags = req.body.tags.split(",").map((tag) => tag.trim());
//       const newImage = {
//         imageTitle: req.body.imageTitle,
//         description: req.body.description,
//         tags: req.body.tags[0] === "" ? [] : req.body.tags,
//         creator: req.session.user.username,
//         storagePath: req.body.storagePath,
//         format: originalImage.format,
//         userId: originalImage.userId,
//         cloudinaryId: originalImage.cloudinaryId,
//       };
//       await imageService.addImage(newImage);
//       res.redirect("/dashboard");
//     } catch (error) {
//       console.error("Error adding image", error);
//       res.status(500).send("An error occurred.");
//     }
//   })();
// });

app.post(
  "/image/editor/update",
  upload.single("imageFile"),
  async (req, res) => {
    try {
      let uploadResult;

      if (req.file) {
        // Assuming multer is configured to use memory storage
        const fileBuffer = req.file.buffer; // This line is crucial

        // Use a Promise wrapper to handle the Cloudinary upload
        uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                resource_type: "auto",
                public_id: req.imageEditor.image.cloudinaryId,
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              },
            )
            .end(fileBuffer);
        });

        console.log("Image updated successfully", uploadResult);
      }
      let storagePath = uploadResult
        ? uploadResult.url
        : req.imageEditor.image.storagePath;

      let format = uploadResult
        ? req.file.mimetype.split("/").pop()
        : req.imageEditor.image.format;

      const newImage = {
        _id: req.body.image_id,
        imageTitle: req.body.imageTitle,
        description: req.body.description,
        tags: req.body.tags.split(",").map((tag) => tag.trim()) || [],
        creator: req.session.user.username,
        storagePath: storagePath, // Consider updating this if needed
        format: format, // Consider updating this if the format might change
        userId: req.imageEditor.image.userId,
        cloudinaryId: req.imageEditor.image.cloudinaryId,
      };

      await imageService.updateImage(newImage);
      res.redirect("/dashboard");
    } catch (error) {
      console.error("Error updating image", error);
      res.status(500).send("An error occurred.");
    }
  },
);

// app.post("/image/editor/grayscale", async (req, res) => {
//   try {
//     const image = await imageService.getImageById(req.body.image_id);

//     const response = await axios.get(image.storagePath, {
//       responseType: "arraybuffer",
//     });

//     const formData = new FormData();
//     formData.append("image", response.data, {
//       filename: "image.jpg",
//       contentType: "image/jpeg",
//     });

//     const processedImageResponse = await axios.post(
//       "http://localhost:8081/upload",
//       formData,
//       {
//         headers: {
//           ...formData.getHeaders(),
//         },
//         responseType: "arraybuffer", // Ensure you get the response as a Buffer
//       },
//     );

//     if (processedImageResponse.data) {
//       // Convert the binary data to a Buffer
//       const imageBuffer = Buffer.from(processedImageResponse.data);

//       // Define the path where the image will be saved
//       const imagePath = path.join(__dirname, "public", "processedImage.jpg");

//       // Write the Buffer to a file
//       fs.writeFile(imagePath, imageBuffer, (err) => {
//         if (err) {
//           console.error("Error saving image:", err);
//           return res
//             .status(500)
//             .send("An error occurred while saving the image.");
//         }

//         console.log("Image saved successfully.");
//         res.json({
//           success: true,
//           message: "Image processed and saved successfully.",
//         });
//       });
//     } else {
//       res.status(500).json({
//         success: false,
//         message: "No data received from processing service.",
//       });
//     }
//   } catch (error) {
//     console.error("Error applying grayscale filter", error);
//     res.status(500).send("An error occurred.");
//   }
// });

app.post("/image/editor/grayscale", async (req, res) => {
  try {
    const response = await axios.get(req.imageEditor.image.storagePath, {
      responseType: "arraybuffer",
    });

    const formData = new FormData();
    formData.append("image", response.data, {
      filename: "image.jpg",
      contentType: "image/jpeg",
    });

    const processedImageResponse = await axios.post(
      "http://localhost:8081/upload",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
        responseType: "arraybuffer", // Ensure you get the response as a Buffer
      },
    );

    if (processedImageResponse.data) {
      // Set the correct content type for the image
      res.set("Content-Type", "image/jpeg");
      // Send the image buffer directly in the response body
      res.send(processedImageResponse.data);
    } else {
      res.status(500).json({
        success: false,
        message: "No data received from processing service.",
      });
    }
  } catch (error) {
    console.error("Error applying grayscale filter", error);
    res.status(500).send("An error occurred.");
  }
});

app.get("/testing", (req, res) => {
  res.render("another", { title: "Testing", user: req.session.user });
});

// app.post("/image/editor/grayscale", async (req, res) => {
//   try {
//     // Assuming imageService.getImageById() correctly retrieves image details
//     const image = await imageService.getImageById(req.body.image_id);

//     // Download the image as a Buffer
//     const response = await axios.get(image.storagePath, {
//       responseType: "arraybuffer",
//     });

//     // Prepare the FormData with the binary image data
//     const formData = new FormData();
//     formData.append("image", response.data, {
//       filename: "image.jpg", // Provide a filename
//       contentType: "image/jpeg", // Set the content type
//     });

//     // Perform the POST request
//     const processedImageResponse = await axios.post(
//       "http://localhost:8081/upload",
//       formData,
//       {
//         headers: {
//           ...formData.getHeaders(), // Important: Get headers for multipart/form-data
//         },
//       },
//     );

//     // Extract and respond with the processed image data or any other specific response data you expect
//     if (processedImageResponse.data) {
//       res.set("Content-Type", "image/jpeg");
//       res.json({ imageData: processedImageResponse.data });
//     } else {
//       res.status(500).json({
//         success: false,
//         message: "No data received from processing service.",
//       });
//     }
//   } catch (error) {
//     console.error("Error applying grayscale filter", error);
//     res.status(500).send("An error occurred.");
//   }
// });

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
