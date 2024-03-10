const mongooseInit = require("./mongoose-init");
const { search } = require("./routes/public");

let Image;
let User;

module.exports.initialize = () => {
  Image = mongooseInit.getModel("Image");
  User = mongooseInit.getModel("User");

  return new Promise((resolve, reject) => {
    resolve();
  });
};

/* Create */

module.exports.addImage = (imageData) => {
  return new Promise((resolve, reject) => {
    let newImage = new Image(imageData);
    newImage
      .save()
      .then(() => resolve())
      .catch((err) => reject(`There was an error creating the image: ${err}`));
  });
};

/* Read */

module.exports.getAllImages = () => {
  return new Promise((resolve, reject) => {
    Image.find()
      .exec()
      .then((images) => resolve(images))
      .catch((err) => reject(`Unable to query images: ${err}`));
  });
};

module.exports.getImageById = (id) => {
  return new Promise((resolve, reject) => {
    Image.find({ _id: id })
      .exec()
      .then((images) => resolve(images[0]))
      .catch((err) => reject(`Unable to query images: ${err}`));
  });
};

module.exports.getImagesByUser = (userId) => {
  return new Promise((resolve, reject) => {
    Image.find({ userId: userId })
      .exec()
      .then((images) => resolve(images))
      .catch((err) => reject(`Unable to query images: ${err}`));
  });
};

module.exports.getImagesByTag = (tag) => {
  return new Promise((resolve, reject) => {
    Image.find({ tags: tag })
      .exec()
      .then((images) => resolve(images))
      .catch((err) => reject(`Unable to query images: ${err}`));
  });
};

module.exports.getImagesByMinDate = (date) => {
  return new Promise((resolve, reject) => {
    Image.find({ createdAt: { $gte: date } })
      .exec()
      .then((images) => resolve(images))
      .catch((err) => reject(`Unable to query images: ${err}`));
  });
};

module.exports.getImagesCustom = (
  searchCondition,
  skip = 0,
  limit = 0,
  lean = false,
) => {
  return new Promise((resolve, reject) => {
    let query = Image.find(searchCondition);

    if (!isNaN(skip) && skip > 0) {
      query = query.skip(skip);
    }

    if (!isNaN(limit) && limit > 0) {
      query = query.limit(limit);
    }

    if (lean) {
      query = query.lean();
    }

    query
      .exec()
      .then((images) => resolve(images))
      .catch((err) => reject(`Unable to query images: ${err}`));
  });
};

module.exports.getImagesCount = (searchCondition) => {
  return new Promise((resolve, reject) => {
    Image.countDocuments(searchCondition)
      .exec()
      .then((count) => resolve(count))
      .catch((err) => reject(`Unable to query images: ${err}`));
  });
};

/* Delete */

module.exports.deleteImage = (id) => {
  return new Promise((resolve, reject) => {
    Image.deleteOne({ _id: id })
      .exec()
      .then(() => resolve())
      .catch((err) => reject(`Unable to delete image: ${err}`));
  });
};

module.exports.deleteImages = (idList) => {
  return new Promise((resolve, reject) => {
    Image.deleteMany({ _id: { $in: idList } })
      .exec()
      .then(() => resolve())
      .catch((err) => reject(`Unable to delete images: ${err}`));
  });
};

/* Update */

module.exports.updateImage = (imageData) => {
  return new Promise((resolve, reject) => {
    Image.updateOne({ _id: imageData._id }, imageData)
      .exec()
      .then(() => resolve())
      .catch((err) => reject(`Unable to update image: ${err}`));
  });
};
