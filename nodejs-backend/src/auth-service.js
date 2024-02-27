//emuwR0Pwsw4v4F5o

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

let Schema = mongoose.Schema;

let userSchema = new Schema({
  userName: { type: String, unique: true },
  password: String,
  email: String,
  loginHistory: [{ dateTime: Date, userAgent: String }],
});

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
    if (userData.password !== userData.password2) {
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
    User.find({ userName: userData.userName })
      .exec()
      .then((users) => {
        if (users.length === 0) {
          reject(`Unable to find user: ${userData.userName}`);
          return;
        }

        bcrypt.compare(userData.password, users[0].password).then((result) => {
          if (result === false) {
            reject(`Incorrect Password for user: ${userData.userName}`);
          } else {
            users[0].loginHistory.push({
              dateTime: new Date().toString(),
              userAgent: userData.userAgent,
            });

            User.updateOne(
              { userName: users[0].userName },
              { $set: { loginHistory: users[0].loginHistory } },
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
        reject(`Unable to find user: ${userData.userName}`);
      });
  });
};
