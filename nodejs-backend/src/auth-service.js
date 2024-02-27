//emuwR0Pwsw4v4F5o

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

let Schema = mongoose.Schema;

let userSchema = new Schema(
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

module.exports.initialize = () => {
  return new Promise(function (resolve, reject) {
    let db = mongoose.createConnection(
      "mongodb+srv://pnicola:emuwR0Pwsw4v4F5o@blogcluster.ntvhqpu.mongodb.net/?retryWrites=true&w=majority&appName=BlogCluster",
    );

    db.on("error", (err) => {
      reject(err);
    });
    db.once("open", () => {
      User = db.model("users", userSchema);
      resolve();
    });
  });
};

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
