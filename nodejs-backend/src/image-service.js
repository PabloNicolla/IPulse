const mongooseInit = require("./mongoose-init");

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
    let getUser = (username) => {
      return new Promise((resolve, reject) => {
        User.findOne({ username: username })
          .exec()
          .then((user) => resolve(user))
          .catch((err) =>
            reject(`Unable to find user with username: ${username}`),
          );
      });
    };

    getUser(imageData.creator).then((user) => {
      if (user) {
        imageData.userId = user._id;
        let newImage = new Image(imageData);
        newImage
          .save()
          .then(() => resolve())
          .catch((err) =>
            reject(`There was an error creating the image: ${err}`),
          );
      } else {
        reject(`Unable to find user with username: ${imageData.username}`);
      }
    });
  });
};

/* Read */

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

/* Delete */

module.exports.deleteImage = (id) => {
  return new Promise((resolve, reject) => {
    Image.deleteOne({ _id: id })
      .exec()
      .then(() => resolve())
      .catch((err) => reject(`Unable to delete image: ${err}`));
  });
};

/* Update */
