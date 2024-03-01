const mongoose = require("mongoose");

let userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    loginHistory: [{ dateTime: Date, userAgent: String }],
    profile: {
      firstName: { type: String, default: null },
      lastName: { type: String, default: null },
      bio: { type: String, default: null },
      profilePicture: { type: String, default: null },
    },
  },
  { timestamps: true },
);

let User;

let imageSchema = new mongoose.Schema(
  {
    imageTitle: { type: String, required: true },
    storagePath: { type: String, required: true },
    format: { type: String, required: true },
    creator: { type: String, required: true },
    tags: [String],
    description: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    cloudinaryId: { type: String, required: true },
  },
  { timestamps: true },
);

let Image;

let blogSchema = new mongoose.Schema(
  {
    authorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [String],
    status: { type: String, required: true },
    comments: [String],
    featuredImage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image",
      required: true,
    },
  },
  { timestamps: true },
);

let Blog;

function initialize() {
  return new Promise(function (resolve, reject) {
    let db = mongoose.createConnection(process.env.DATABASE_CONNECTION_STRING);

    db.on("error", (err) => {
      reject(err);
    });
    db.once("open", () => {
      Image = db.model("images", imageSchema);
      User = db.model("users", userSchema);
      Blog = db.model("blogs", blogSchema);
      resolve();
    });
  });
}

function getModel(modelName) {
  switch (modelName) {
    case "User":
      return User;
    case "Image":
      return Image;
    case "Blog":
      return Blog;
    default:
      return null;
  }
}

module.exports = {
  getModel,
  initialize,
};
