const authService = require("../auth-service"); // Example service module for auth
const imageService = require("../image-service"); // Example service module for images

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
    const images = await imageService.getImagesByUser(req.session.user.userId);

    const itemsPerPage = 2;
    let page = req.query.page ? parseInt(req.query.page) : 1; // Default to page 1 if not provided
    const offset = (page - 1) * itemsPerPage;

    const paginatedItems = images.slice(offset, offset + itemsPerPage);
    const totalPages = Math.ceil(images.length / itemsPerPage);

    const now = new Date(); // Get the current time
    const thirtyMinutes = 5 * 60 * 60 * 1000; // 5hrs in milliseconds
    for (img of paginatedItems) {
      var updatedAt = new Date(img.updatedAt); // Ensure updatedAt is a Date object
      img.isRecent = now - updatedAt < thirtyMinutes; // Compare the time difference
    }

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
};

exports.getDashboardRecommendations = (req, res) => {
  const query = req.query.q;
  // Implement logic to find recommendations based on the query
  // This is just a placeholder response
  const recommendations = ["Suggestion 1", "Suggestion 2", "Suggestion 3"];
  res.json(recommendations);
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
