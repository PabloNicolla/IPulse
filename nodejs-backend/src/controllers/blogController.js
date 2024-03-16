const authService = require("../services/auth-service");
const imageService = require("../services/image-service");
// const blogService = require("../services/blog-service");

exports.getBlogPage = async (req, res) => {
  try {
    const itemsPerPage = 2;
    const page = req.query.page ? parseInt(req.query.page) : 1; // Default to page 1 if not provided
    const offset = (page - 1) * itemsPerPage;

    const searchCondition = {};
    if (req.query.q) {
      const search = req.query.q;
      // Using $regex to search for non-exact matches. 'i' option for case-insensitive search.
      searchCondition = {
        $or: [
          { imageTitle: { $regex: search, $options: "i" } },
          { creator: { $regex: search, $options: "i" } },
          { tags: { $regex: search, $options: "i" } },
        ],
      };
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

    // Check if request is AJAX
    if (req.xhr || req.headers.accept.indexOf("json") > -1) {
      // Send JSON response for AJAX request
      res.json({
        images,
        currentPage: page,
        totalPages: totalPages,
      });
    } else {
      // Render full page for normal request
      res.render("blog", {
        title: "NovaBlog",
        user: req.session.user,
        cards: images,
        currentPage: page,
        totalPages: totalPages,
        cQuery: req.query.q,
      });
    }
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).send("An error occurred.");
  }
};
