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

exports.getSearchPage = (req, res) => {
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
};

exports.getSearchRecommendations = (req, res) => {
  const query = req.query.q;
  // Implement logic to find recommendations based on the query
  // This is just a placeholder response
  const recommendations = ["Suggestion 1", "Suggestion 2", "Suggestion 3"];
  res.json(recommendations);
};

exports.setTheme = (req, res) => {
  const { theme } = req.body;
  req.theme_session.theme = theme;
  res.status(200).send("Theme updated");
};

exports.getTheme = (req, res) => {
  const theme = req.theme_session.theme || "light"; // Default to light theme if not set
  res.json({ theme });
};
