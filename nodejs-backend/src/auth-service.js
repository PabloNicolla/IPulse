const bcrypt = require("bcryptjs");
const mongooseInit = require("./mongoose-init");
const { getRedisClient } = require("./redis-service");

let redisClient;
let User;

module.exports.initialize = async () => {
  try {
    User = mongooseInit.getModel("User");
    redisClient = await getRedisClient();
  } catch (error) {
    throw new Error("Error initializing auth service", error);
  }
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

module.exports.getUserByUsername = async (username) => {
  try {
    const cachedUser = await redisClient.get(`user:${username}`);
    if (cachedUser) {
      return JSON.parse(cachedUser); // Return the cached user
    }

    const user = await User.findOne({
      username: username,
    })
      .lean()
      .exec();
    if (!user) {
      throw new Error(`Unable to find user with username: ${username}`);
    }

    await redisClient.set(`user:${username}`, JSON.stringify(user), {
      EX: 3600,
    }); // Cache for 1 hour
    return user;
  } catch (err) {
    throw new Error(err);
  }
};

/* Update */

module.exports.updateUserProfile = async (username, profileData) => {
  try {
    let updateObject = {};
    for (const [key, value] of Object.entries(profileData)) {
      updateObject[`profile.${key}`] = value;
    }
    await User.updateOne({ username }, { $set: updateObject }).exec();
    await redisClient.del(`user:${username}`); // Invalidate the cache
    return "User profile updated successfully.";
  } catch (err) {
    throw new Error(`There was an error updating the user profile: ${err}`);
  }
};
