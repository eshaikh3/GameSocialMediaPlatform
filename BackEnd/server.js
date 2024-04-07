// dotenv configuration
const dotenv = require("dotenv");
dotenv.config();

// Users (includes Messages) Mongoose Data (users.js uses dotenv, so thats why dotenv is on top)
const usersDB = require("./users");

// Cloudinary
const cloudinary = require("./cloudinary");

const { sendMail } = require("./nodemailerAuth");

// Express
const express = require("express");
const app = express();

// Cross-Origin Resource Sharing
const cors = require("cors");
app.use(cors());

// JSON parse
app.use(express.json());

// File System Module to delete previous image
const fs = require("fs");

// Path, Multer and Storage
const path = require("path");
const multer = require("multer");

// Using static file - public
app.use(express.static('/public'));

const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public");
    },
    filename: (req, file, cb) => {
        let imageName = file.originalname.split(".")[0] + '-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, imageName);
    }
});

const uploadImage = multer({
    storage: imageStorage,
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return cb(new Error('Only images are allowed'));
        }
        cb(null, true)
    },
    limits: {
        fileSize: 1 * 1024 * 1024 // fileSize in bytes
    }
});


// Http Port 
const HTTP_PORT = process.env.PORT || 8080;
const onHttpStart = () => {
    console.log(`Server listening on port : ${HTTP_PORT}`);
};


// ************* Routes **************

// ======================== USER DATA HANDLING ========================
// GET - Home or /
app.get("/", (req, res) => {
    res.status(200).json({ message: "API is listening . . . " });
});

// POST - login user
app.post("/login", (req, res) => {
    usersDB.login(req.body)
        .then(user => {
            res.status(200).json({ message: "success", user: user });
        })
        .catch(err => res.status(422).json({ message: "fail", reply: err }));
});

// POST - register user
app.post("/register", (req, res) => {
    usersDB.registerUser(req.body)
        .then(result => {
            res.status(200).json({ message: "success", reply: result });
        })
        .catch(err => res.status(422).json({ message: "fail", reply: err }));
});

// GET - User by userName
app.get("/user/:userName", (req, res) => {
    usersDB.getUserByUserName(req.params.userName)
        .then(user => {
            res.status(200).json({ message: "success", user: user });
        })
        .catch(err => res.status(422).json({ message: "fail", reply: err }));
});

// PUT - update user Setting
app.put("/update", (req, res) => {
    //console.log(req.body);
    usersDB.updateUserSetting(req.body)
        .then(result => {
            res.status(200).json({ message: "success", user: result.user });
        })
        .catch(err => res.status(422).json({ message: "fail", reply: err }));
});

// PUT - update user Setting
app.put("/updateImage", uploadImage.single("image"), async (req, res) => {

    try {
        const result = await cloudinary.uploader.upload(req.file.path);
        req.body.imageUrl = result.url;
        req.body.imagePublicId = result.public_id;

        // Remove file from local uploads folder
        fs.unlinkSync(req.file.path);

        // Deleting property image from req.body as "image" is an image
        delete req.body.image;

        usersDB.updateUserSettingWithImage(req.body)
            .then(result => {
                // Previous image deleted
                cloudinary.uploader.destroy(result.previousImagePublicId, function (resultDestroy) {
                    if (resultDestroy != null) {
                        console.log(resultDestroy);
                    }
                });
                res.status(200).json({ message: "success", user: result.user });
            })
            .catch(err => {
                res.status(422).json({ message: "fail", reply: err.reply })
            });
    } catch (err) {
        // Remove file from local uploads folder
        fs.unlinkSync(req.file.path);
        console.log(err);
    }
});


// PUT - update friend List and remove friend from request
app.put("/updateFriend", (req, res) => {
    usersDB.addUserFriends(req.body)
        .then(user => {
            res.status(200).json({ message: "success", user: user });
        })
        .catch(err => res.status(422).json({ message: "fail", reply: err }));
});

// PUT - update friend List and remove friend from request
app.put("/removeFriend", (req, res) => {
    usersDB.removeUserFriends(req.body)
        .then(user => {
            res.status(200).json({ message: "success", user: user });
        })
        .catch(err => res.status(422).json({ message: "fail", reply: err }));
});

// PUT - update friend request List
/* app.put("/updateFriendRequest", (req, res) => {
    usersDB.addUserFriendsRequest(req.body)
        .then(user => {
            res.status(200).json({ message: "success" });
        })
        .catch(err => res.status(422).json({ message: "fail", reply: err }));
}); */

// GET - Users by userName, firstName and lastName
app.get("/users/:searchInput", (req, res) => {
    usersDB.getUsersBySearchInput(req.params.searchInput)
        .then(user => {
            res.status(200).json({ message: "success", user: user });
        })
        .catch(err => res.status(422).json({ message: "fail", reply: err }));
});

// POST - Forgot Password
app.post("/forgotpassword", (req, res) => {
    usersDB.updateUserRandomPassword(req.body.email)
        .then(password => {
            //console.log(password);
            sendMail(req.body.email, password)
                .then(result => {
                    res.status(200).json({ message: "success", reply: result });
                })
                .catch(err => {
                    res.status(400).json({ message: "fail" });
                });
        })
        .catch(err => {
            res.status(400).json({ message: "fail" });
        });
});

// DELETE - user
app.delete("/delete", (req, res) => {
    usersDB.deleteUser(req.body)
        .then(result => {
            // Previous image deleted
            cloudinary.uploader.destroy(result.previousImagePublicId, function (resultDestroy) {
                if (resultDestroy != null) {
                    console.log(resultDestroy);
                }
            });

            res.status(200).json({ message: "success", reply: result.message });
        })
        .catch(err => res.status(422).json({ message: "fail", reply: err }));
});


// ======================== MESSAGES ===========================
// GET - Messages
app.get("/conversations/:user", (req, res) => {
    //console.log(req.body.recipients);
    usersDB.getAllConversationsByUser(req.params.user)
        .then(messagesData => {
            if (messagesData.length != 0) {
                res.status(200).json({ message: "success", conversationsData: messagesData });
            }
            else {
                res.status(200).json({ message: "no data", conversationsData: messagesData });
            }
        })
        .catch(err => res.status(422).json({ message: "fail", reply: err }));
});

// GET - Messages
app.post("/messages", (req, res) => {
    //console.log(req.body.recipients);
    usersDB.getAllMessagesByRecipients(req.body.recipients)
        .then(messagesData => {
            if (messagesData) {
                res.status(200).json({ message: "success", messagesData: messagesData });
            }
            else {
                res.status(200).json({ message: "no data", messagesData: messagesData });
            }
        })
        .catch(err => res.status(422).json({ message: "fail", reply: err }));
});

app.put("/storemessage", (req, res) => {
    usersDB.storeMessages(req.body.messageInfo)
        .then(result => {
            res.status(200).json({ message: "success", reply: result });
        })
        .catch(err => res.status(422).json({ message: "fail", reply: err }));
});

// ======================== LEADERBOARDS ===========================
// GET - Leaderboard by gameName
app.get("/leaderboard/:gameName", (req, res) => {
    usersDB.getLeaderboard(req.params.gameName)
        .then(result => {
            res.status(200).json({ message: "success", gameData: result })
        })
        .catch(err => res.status(422).json({ message: "fail", reply: err }));
});

// PUT - user score in the Leaderboard
app.put("/updateLeaderboard", (req, res) => {
    usersDB.updateLeaderboard(req.body)
        .then(result => {
            res.status(200).json({ message: "success", gameData: result })
        })
        .catch(err => res.status(422).json({ message: "fail", reply: err }));
});

// Initializing the connection and Listening
usersDB.connect()
    //messagesDB.connect()
    .then(() => {
        app.listen(HTTP_PORT, onHttpStart);
    })
    .catch((err) => {
        console.log("unable to start the server . . .");
        process.exit();
    });
