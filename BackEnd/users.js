// Random password generator
const generator = require('generate-password');

// mongoose library
const mongoose = require("mongoose");
// mongoose.set('useFindAndModify', false);

// Bcrypt library
const bcrypt = require("bcryptjs");

// Connection string
let mongooseConnectionString = process.env.MONGO_USER_URL;

let Schema = mongoose.Schema;

// =====================================================================
// ================== Users ==================
let userSchema = new Schema({
    userName: {
        type: String,
        unique: true, // throw an error if same userName was passed in while signup
        required: true,
        maxLength: 64,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true, // will not work if the email isn't provided
        lowercase: true, // Will save emails in lowercase
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 64,
    },
    firstName: {
        type: String,
        required: true,
        maxLength: 64,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        maxLength: 64,
        trim: true,
    },
    birthday: {
        type: Date, // Still need to implement +13 years of age
        required: true,
        // immutable: true, // Cannot change the date
    },
    privacy: {
        type: Boolean,
        required: true,
    },
    // User profile information 
    description: {
        type: String,
        maxLength: 500,
    },
    gender: {
        type: String,
        maxLength: 20,
    },
    location: {
        type: String,
        maxLength: 50,
        trim: true,
    },
    imageUrl: {
        type: String,
    },
    imagePublicId: {
        type: String,
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        unique: true,
    }],
    /* friendsRequest: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        unique: true,
    } ], */
});

let Users;

// =====================================================================
// ================== Messages ==================
let messagesSchema = new Schema({
    recipients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        unique: false,
        autoIndex: false
    }],
    messages: [{
        to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        },
        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        },
        content: {
            type: String,
            maxLength: 500,
            trim: true
        },
        time: {
            type: Date
        }
    }]
});

let Messages;

// =====================================================================
// ================== LEADERBOARD ==================
let leaderboardsSchema = new Schema({
    gameName: {
        type: String,
        unique: true,
        maxLength: 50,
        trim: true,
    },
    leaderboard: [{
        userName: {
            type: String,
            index: true,
            unique: true,
            sparse: true,
            required: true,
            maxLength: 64,
            trim: true,

        },
        score: {
            type: Number
        }
    }]
});

let Leaderboards;

// =====================================================================
// =====================================================================
// =====================================================================

module.exports.connect = function () {
    return new Promise((resolve, reject) => {
        let db = mongoose.createConnection(mongooseConnectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        db.on("error", err => {
            reject(err);
        });

        db.once("open", () => {
            Users = db.model("users", userSchema);
            Messages = db.model("messages", messagesSchema);
            Leaderboards = db.model("leaderboards", leaderboardsSchema);
            resolve();
        });
    });
};

module.exports.registerUser = function (userInfo) {
    return new Promise(function (resolve, reject) {
        bcrypt.hash(userInfo.password, 10)
            .then(hash => {
                userInfo.password = hash;

                let newUser = new Users(userInfo);
                newUser.save(err => {
                    if (err) {
                        if (err.code == 11000) {
                            reject("User Already Exists");
                        }
                        else {
                            reject("There was an error creating new User, error: " + err);
                        }
                    }

                    resolve("Successfully added to the database.");
                });
            })
            .catch(err => reject("Problem as hashing, error: " + err));
    });
};


module.exports.login = function (userInfo) {
    return new Promise(function (resolve, reject) {
        Users.findOne({ email: userInfo.email })
            .populate("friends", { userName: 1, firstName: 1, lastName: 1, imageUrl: 1 })
            /* .populate("friendsRequest", { userName: 1, email: 1, firstName: 1, lastName: 1, imageUrl: 1 }) */
            .exec()
            .then(user => {
                bcrypt.compare(userInfo.password, user.password)
                    .then(result => {
                        if (result == true) {
                            resolve(user);
                        }
                        else reject("Password incorrect!");
                    });

            })
            .catch(err => reject("Unable to find user"));
    });
};

module.exports.getUserByUserName = function (userName) {
    return new Promise(function (resolve, reject) {
        Users.findOne({ userName: userName }, "userName email firstName lastName birthday description gender location imageUrl")
            .exec()
            .then(user => {
                resolve(user);
            })
            .catch(err => reject("Unable to find user"));
    });
};

module.exports.updateUserSetting = function (userInfo) {
    return new Promise(function (resolve, reject) {
        bcrypt.hash(userInfo.password, 10)
            .then(hash => {
                userInfo.password = hash;

                // After hashing the password, update the user profile
                Users.findOneAndUpdate({ _id: userInfo._id }, userInfo, { new: true })
                    .populate("friends", { userName: 1, firstName: 1, lastName: 1, imageUrl: 1 })
                    .then(user => resolve({ user: user }))
                    .catch(err => reject("Unable to find user and update it"));
            })
            .catch(err => reject("Problem at hashing, error: " + err));
    });
};

module.exports.updateUserSettingWithImage = function (userInfo) {
    return new Promise(function (resolve, reject) {
        let previousImagePublicId = "";

        // Deleting image from the server storage
        Users.findById(userInfo._id)
            .exec()
            .then(user => {
                previousImagePublicId = user.imagePublicId;
            })
            .catch(err => reject("Unable to find user"));

        bcrypt.hash(userInfo.password, 10)
            .then(hash => {
                userInfo.password = hash;

                // After hashing the password, update the user profile
                Users.findOneAndUpdate({ _id: userInfo._id }, userInfo, { new: true })
                    .populate("friends", { userName: 1, firstName: 1, lastName: 1, imageUrl: 1 })
                    /* .populate("friendsRequest", { userName: 1, email: 1, firstName: 1, lastName: 1, imageUrl: 1 }) */
                    .then(user => resolve({ user: user, previousImagePublicId: previousImagePublicId }))
                    .catch(err => reject({ reply: "Unable to find user and update it" }));
            })
            .catch(err => reject("Problem as hashing, error: " + err));
    });
};

module.exports.updateUserRandomPassword = function (email) {
    return new Promise(function (resolve, reject) {
        var password = generator.generate({
            length: 10,
            numbers: true,
            uppercase: true,
            lowercase: true
        });

        bcrypt.hash(password, 10)
            .then(hash => {

                // After hashing the password, update the user profile
                Users.findOneAndUpdate({ email: email }, { password: hash }, { new: true })
                    .then(user => resolve({ password: password }))
                    .catch(err => reject({ reply: "Unable to find user and change password" }));
            })
            .catch(err => reject("Problem as hashing, error: " + err));
    });
};

module.exports.addUserFriends = function (userInfo) {
    return new Promise(function (resolve, reject) {
        // Also updating friend requester's friends list
        /* Users.findOneAndUpdate({ _id: userInfo.friendId }, { $addToSet: { friends: userInfo._id } }, { new: true })
            .then(friendUser => console.log("Done adding friends"))
            .catch(err => reject({ reply: "Unable to find friend user and update friends list" })); */

        Users.findOneAndUpdate({ _id: userInfo._id }, { $addToSet: { friends: userInfo.friendId }/*, $pull: { friendsRequest: userInfo.friendId } */ }, { new: true })
            .populate("friends", { userName: 1, firstName: 1, lastName: 1, imageUrl: 1 })
            /* .populate("friendsRequest", { userName: 1, email: 1, firstName: 1, lastName: 1, imageUrl: 1 }) */
            .then(user => {
                resolve(user);
            })
            .catch(err => reject({ reply: "Unable to find user and update friends list" }));
    });
};

module.exports.removeUserFriends = function (userInfo) {
    return new Promise(function (resolve, reject) {
        Users.findOneAndUpdate({ _id: userInfo._id }, { $pull: { friends: userInfo.friendId } }, { new: true })
            .populate("friends", { userName: 1, firstName: 1, lastName: 1, imageUrl: 1 })
            /* .populate("friendsRequest", { userName: 1, email: 1, firstName: 1, lastName: 1, imageUrl: 1 }) */
            .then(user => {
                resolve(user);
            })
            .catch(err => reject({ reply: "Unable to find user and update friends list" }));
    });
};

/* module.exports.addUserFriendsRequest = function (userInfo) {
    return new Promise(function (resolve, reject) {
        Users.findOneAndUpdate({ _id: userInfo.requestId }, { $addToSet: { friendsRequest: userInfo._id } }, { new: true }) 
            .then(user => resolve())
            .catch(err => reject({ reply: "Unable to find user and update friends list" }));
    });
}; */

module.exports.getUsersBySearchInput = function (searchString) {
    return new Promise(function (resolve, reject) {
        Users.find({
            $or: [
                { userName: { $regex: new RegExp(searchString, "i") } },
                { firstName: { $regex: new RegExp(searchString, "i") } },
                { lastName: { $regex: new RegExp(searchString, "i") } },
            ]
        }, "userName email firstName lastName birthday description gender location imageUrl")
            .exec()
            .then(user => {
                //console.log(user);
                resolve(user);
            })
            .catch(err => reject("Unable to find user"));
    });
};

module.exports.deleteUser = function (userInfo) {
    return new Promise(function (resolve, reject) {
        let previousImagePublicId = "";

        // Deleting image from the server storage
        Users.findById(userInfo._id)
            .exec()
            .then(user => {
                previousImagePublicId = user.imagePublicId;
            })
            .catch(err => reject("Unable to find user"));

        // After hashing the password, update the user profile
        Users.findOneAndRemove({ _id: userInfo._id })
            .then(() => resolve({ message: "User was successfully deleted", previousImagePublicId: previousImagePublicId }))
            .catch(err => reject("Unable to find user and remove it"));
    });
};


// =====================================================================
// =====================================================================
// =====================================================================

module.exports.getAllConversationsByUser = function (user) {
    return new Promise(function (resolve, reject) {
        //console.log(recipients);
        Messages.find({ recipients: { $all: user } }, { recipients: 1 })
            .populate("recipients", { userName: 1, firstName: 1, lastName: 1, imageUrl: 1 })
            .exec()
            .then(messagesData => {
                //console.log(messagesData);
                // filter out the user requesting the conversations and then flatten the array
                // to only have a 1D array
                resolve(messagesData.map(convo => convo.recipients.filter(userId => userId._id != user)).flat(1));
            })
            .catch(err => {
                //console.log(err);
                reject("Unable to find user' messages")
            });
    });
}

module.exports.getAllMessagesByRecipients = function (recipients) {
    return new Promise(function (resolve, reject) {
        //console.log(recipients);
        Messages.findOne({ recipients: { $all: recipients } })
            .populate("messages.to", { userName: 1, firstName: 1, lastName: 1, imageUrl: 1 })
            .populate("messages.from", { userName: 1, firstName: 1, lastName: 1, imageUrl: 1 })
            .exec()
            .then(messagesData => {
                //console.log(messagesData);
                resolve(messagesData);
            })
            .catch(err => {
                //console.log(err);
                reject("Unable to find recipients' messages")
            });
    });
}

module.exports.storeMessages = function (messageInfo) {
    return new Promise(function (resolve, reject) {
        // Check if the recipients already have a messages document
        // if not then create a new document for them
        Messages.findOneAndUpdate(
            { recipients: { $all: messageInfo.recipients } },
            { $push: { messages: messageInfo.message } },
            { new: true },
            function (err, result) {
                if (!err) {
                    // If the document doesn't exist
                    if (!result) {
                        // Create it
                        let messageObject = {
                            recipients: messageInfo.recipients,
                            messages: [messageInfo.message]
                        }
                        let newMessage = new Messages(messageObject);
                        newMessage.save(err => {
                            if (err) {
                                //console.log(err);
                                reject("There was an error creating new Message, error: " + err);
                            }

                            resolve("Successfully added message to the database.");
                        });
                    }
                    else {
                        // Save the document
                        result.save(function (err) {
                            if (!err) {
                                resolve("Successfully updated message to the database");
                            } else {
                                reject("There was an error creating new Message, error: " + err);
                            }
                        });
                    }

                }
                else {
                    reject("Problem at finding and updating one");
                }
            }
        )
    });
};

// =====================================================================
// =====================================================================
// =====================================================================

// Populating function
/* module.exports.createLeaderboard = function () {

    let newLeaderboard = new Leaderboards({
        gameName: "towerDefense",
        leaderboard: []
    });
    newLeaderboard.save(err => {
        if (err) {
            if (err.code == 11000) {
                console.log(err);
            }
            else {
                console.log("There was an error creating new leaderboard, error: " + err);
            }
        }
    });

    let newLeaderboard2 = new Leaderboards({
        gameName: "spaceInvaders",
        leaderboard: []
    });
    newLeaderboard2.save(err => {
        if (err) {
            if (err.code == 11000) {
                console.log(err);
            }
            else {
                console.log("There was an error creating new leaderboard, error: " + err);
            }
        }
    });

    console.log("done");
} */

module.exports.getLeaderboard = function (gameName) {
    return new Promise(function (resolve, reject) {
        //console.log(recipients);
        Leaderboards.findOne({ gameName: gameName })
            .exec()
            .then(leaderboardData => {
                resolve(leaderboardData);
            })
            .catch(err => {
                //console.log(err);
                reject("Unable to find leaderboard for the game")
            });
    });
};

module.exports.updateLeaderboard = function (userInfo) {
    return new Promise(function (resolve, reject) {
        // console.log(userInfo);
        Leaderboards.findOne({ "gameName": userInfo.gameName, "leaderboard.userName": userInfo.userName })
            .exec()
            .then(leaderboardData => {
                //console.log(leaderboardData, "leaderboardData");
                if (leaderboardData) {
                    userScore = leaderboardData.leaderboard.find(user => user.userName == userInfo.userName);

                    if (userScore.score < userInfo.score) {
                        Leaderboards.findOneAndUpdate(
                            { "gameName": userInfo.gameName, "leaderboard.userName": userInfo.userName },
                            { $set: { "leaderboard.$": { userName: userInfo.userName, score: userInfo.score } } },
                            { new: true })
                            .then(result => {
                                resolve(result);
                            })
                            .catch(err => reject(err));
                    }
                    else {
                        resolve(leaderboardData);
                    }
                    // If the user's score is higher than newScore
                }
                else {
                    Leaderboards.findOneAndUpdate(
                        { "gameName": userInfo.gameName },
                        { $push: { leaderboard: { userName: userInfo.userName, score: userInfo.score } } },
                        { new: true })
                        .then(result => {
                            resolve(result);
                        })
                        .catch(err => reject(err));
                };
            })
            .catch(err => {
                reject("Something wrong at findOne updateLeaderboard()");
            });

    })
}
