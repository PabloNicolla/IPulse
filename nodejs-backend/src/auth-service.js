const bcrypt = require("bcryptjs");
const mongooseInit = require("./mongoose-init");

let User;

module.exports.initialize = () => {
  User = mongooseInit.getModel("User");

  return new Promise((resolve, reject) => {
    resolve();
  });
};

/* Create */

module.exports.registerUser = (userData) => {
  return new Promise((resolve, reject) => {
    if (userData.password !== userData.confirmPassword) {
      reject("Passwords do not match");
      return;
    }

    function addUser() {
      let newUser = new User(userData);

      newUser
        .save()
        .then(() => resolve())
        .catch((err) => {
          if (err.code === 11000) reject("User Name already taken");
          else reject(`There was an error creating the user: ${err}`);
        });
    }

    bcrypt
      .hash(userData.password, 10)
      .then((hash) => {
        userData.password = hash;
        addUser();
      })
      .catch((err) => {
        reject("There was an error encrypting the password");
        return;
      });
  });
};

/* Read */

module.exports.checkUser = (userData) => {
  return new Promise((resolve, reject) => {
    User.find({ username: userData.username })
      .exec()
      .then((users) => {
        if (users.length === 0) {
          reject(`Unable to find user: ${userData.username}`);
          return;
        }

        bcrypt.compare(userData.password, users[0].password).then((result) => {
          if (result === false) {
            reject(`Incorrect Password for user: ${userData.username}`);
          } else {
            User.updateOne(
              { username: users[0].username },
              {
                $push: {
                  loginHistory: {
                    dateTime: new Date().toString(),
                    userAgent: userData.userAgent,
                  },
                },
              },
            )
              .exec()
              .then(() => resolve(users[0]))
              .catch((err) =>
                reject(`There was an error verifying the user: ${err}`),
              );
          }
        });
      })
      .catch((err) => {
        reject(`Unable to find user: ${userData.username}`);
      });
  });
};

module.exports.getUserByUsername = (username) => {
  return new Promise((resolve, reject) => {
    User.findOne({ username: username })
      .exec()
      .then((user) => resolve(user))
      .catch((err) => reject(`Unable to find user with username: ${username}`));
  });
};

/* Update */

module.exports.updateUserProfile = (username, profileData) => {
  return new Promise((resolve, reject) => {
    let updateObject = {};
    for (const [key, value] of Object.entries(profileData)) {
      updateObject[`profile.${key}`] = value;
    }

    User.updateOne({ username }, { $set: updateObject })
      .exec()
      .then(() => resolve("User profile updated successfully."))
      .catch((err) =>
        reject(`There was an error updating the user profile: ${err}`),
      );
  });
};
