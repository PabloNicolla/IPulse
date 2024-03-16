const authService = require("../services/auth-service");
const imageService = require("../services/image-service");

exports.getRegisterPage = (req, res) => {
  if (req.session.user) {
    res.redirect("/users/dashboard");
  }
  res.render("register", {
    title: "Register",
    user: req.session.user,
    message: { type: "", text: "", username: "", email: "" },
  });
};

exports.registerUser = async (req, res) => {
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
};

exports.getLoginPage = (req, res) => {
  if (req.session.user) {
    res.redirect("/users/dashboard");
  }
  res.render("login", {
    title: "Login",
    user: req.session.user,
    errorMessage: "",
    username: "",
  });
};

exports.loginUser = async (req, res) => {
  req.body.userAgent = req.get("User-Agent");
  try {
    const user = await authService.checkUser(req.body);
    req.session.user = {
      username: user.username,
      userId: user._id,
      profilePicture: user.profile.profilePicture || null,
    };

    res.redirect("/users/dashboard");
  } catch (err) {
    res.render("login", {
      title: "Login",
      user: req.session.user,
      errorMessage: err,
      username: req.body.username,
    });
  }
};

exports.logout = (req, res) => {
  res.session = null;
  res.clearCookie("session");
  res.redirect("/homepage");
};

exports.getDashboardPage = async (req, res) => {
  try {
    const itemsPerPage = 2;
    const page = req.query.page ? parseInt(req.query.page) : 1; // Default to page 1 if not provided
    const offset = (page - 1) * itemsPerPage;

    let searchCondition = {};
    if (req.query.q) {
      const search = req.query.q;
      // Using $regex to search for non-exact matches. 'i' option for case-insensitive search.
      searchCondition = {
        $and: [
          { userId: req.session.user.userId }, // Ensure creator matches the query
          {
            $or: [
              { imageTitle: { $regex: search, $options: "i" } },
              { tags: { $regex: search, $options: "i" } },
            ],
          },
        ],
      };
    } else {
      searchCondition = { userId: req.session.user.userId };
    }

    const images = await imageService.getImagesCustom(
      searchCondition,
      offset,
      itemsPerPage,
    );
    const totalMatches = await imageService.getImagesCount(searchCondition);

    const totalPages = Math.ceil(totalMatches / itemsPerPage);

    const now = new Date(); // Get the current time
    const thirtyMinutes = 5 * 60 * 60 * 1000; // 5hrs in milliseconds
    for (img of images) {
      var updatedAt = new Date(img.updatedAt); // Ensure updatedAt is a Date object
      img.isRecent = now - updatedAt < thirtyMinutes; // Compare the time difference
    }

    res.render("dashboard", {
      title: "Dashboard",
      user: req.session.user,
      cards: images,
      currentPage: page,
      totalPages: totalPages,
      cQuery: req.query.q,
    });
  } catch (error) {
    console.error("Error fetching dashboard data", error);
    res.status(500).send("An error occurred.");
  }
};

exports.getDashboardRecommendations = async (req, res) => {
  const query = req.query.q;

  if (!query || query.length < 3) {
    return res.json([]); // Return empty array if query is too short or missing
  }

  const regexPattern = new RegExp(query, "i"); // Case-insensitive regex pattern based on the query

  // Define your search condition using $regex for partial matching and $or to search across fields
  const searchCondition = {
    $and: [
      { userId: req.session.user.userId }, // Ensure creator matches the query
      {
        $or: [
          { imageTitle: { $regex: regexPattern } },
          { tags: { $regex: regexPattern } },
        ],
      },
    ],
  };

  try {
    const recommendations = await imageService.getImagesCustom(
      searchCondition,
      0,
      10,
      true,
    );

    let formattedRecommendations = new Set(); // Use a set to avoid duplicate recommendations
    recommendations.forEach((rec) => {
      // Apply the regex to filter matching fields within each document
      if (regexPattern.test(rec.imageTitle)) {
        formattedRecommendations.add(rec.imageTitle);
      }
      if (regexPattern.test(rec.creator)) {
        formattedRecommendations.add(rec.creator);
      }
      rec.tags.forEach((tag) => {
        if (regexPattern.test(tag)) {
          formattedRecommendations.add(tag);
        }
      });
    });

    res.json(Array.from(formattedRecommendations));
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ message: "Error fetching recommendations" });
  }
};

exports.getProfilePage = (req, res) => {
  res.render("profile-form", {
    title: "Profile Update",
    user: req.session.user,
  });
};

exports.updateProfile = async (req, res) => {
  try {
    const uploaded = req.cloudinaryResult;
    req.body.profilePicture = uploaded.url;

    await authService.updateUserProfile(req.session.user.username, req.body);
    req.session.user.profilePicture = uploaded.url;
    res.redirect("/users/dashboard");
  } catch (error) {
    console.error("Error updating profile", error);
    res.status(500).send("An error occurred during profile update.");
  }
};
