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

const authService = require("../auth-service"); // Example service module for auth
const imageService = require("../image-service"); // Example service module for images

exports.getRoot = (req, res) => {
  res.redirect("/homepage");
};

exports.getHomepage = (req, res) => {
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
};

exports.getAboutUsPage = (req, res) => {
  res.render("about-us", { title: "About Us", user: req.session.user });
};

exports.getTermsOfServicePage = (req, res) => {
  res.render("terms-of-service", {
    title: "Terms of Service",
    user: req.session.user,
  });
};

exports.getPrivacyPolicyPage = (req, res) => {
  res.render("privacy-policy", {
    title: "Privacy Policy",
    user: req.session.user,
  });
};

exports.getSupportPage = (req, res) => {
  res.render("support", { title: "Support", user: req.session.user });
};

exports.getSearchPage = async (req, res) => {
  try {
    const itemsPerPage = 2;
    let page = req.query.page ? parseInt(req.query.page) : 1; // Default to page 1 if not provided
    const offset = (page - 1) * itemsPerPage;

    let searchCondition = {};
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

    res.render("search", {
      title: "Search",
      user: req.session.user,
      cards: images,
      currentPage: page,
      totalPages: totalPages,
      cQuery: req.query.q,
    });
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).send("An error occurred.");
  }
};

exports.getSearchRecommendations = async (req, res) => {
  const query = req.query.q;

  if (!query || query.length < 3) {
    return res.json([]); // Return empty array if query is too short or missing
  }

  // Define your search condition using $regex for partial matching and $or to search across fields
  const searchCondition = {
    $or: [
      { imageTitle: { $regex: query, $options: "i" } }, // Case-insensitive
      { creator: { $regex: query, $options: "i" } },
      { tags: { $regex: query, $options: "i" } },
    ],
  };

  try {
    // Find up to 10 documents matching the search condition
    const recommendations = await imageService.getImagesCustom(
      searchCondition,
      0,
      10,
      true, // Set lean to true for better performance
    );

    // Transform the recommendations to the desired format if needed
    // For example, you might want to concatenate fields or just return titles
    let formattedRecommendations = [];
    for (let i = 0; i < recommendations.length; i++) {
      if (i % 3 === 0) {
        formattedRecommendations.push(recommendations[i].imageTitle);
      } else if (i % 3 === 1) {
        formattedRecommendations.push(recommendations[i].creator);
      } else {
        formattedRecommendations.push(recommendations[i].tags);
      }
    }

    res.json(formattedRecommendations);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ message: "Error fetching recommendations" });
  }
};

// exports.getSearchRecommendations = (req, res) => {
//   const query = req.query.q;
//   // Implement logic to find recommendations based on the query
//   // This is just a placeholder response
//   const recommendations = ["Suggestion 1", "Suggestion 2", "Suggestion 3"];
//   res.json(recommendations);
// };

exports.setTheme = (req, res) => {
  const { theme } = req.body;
  req.theme_session.theme = theme;
  res.status(200).send("Theme updated");
};

exports.getTheme = (req, res) => {
  const theme = req.theme_session.theme || "light"; // Default to light theme if not set
  res.json({ theme });
};
