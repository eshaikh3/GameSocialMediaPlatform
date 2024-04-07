const express = require("express");

const app = express();

const cors = require("cors");

app.use(cors());

const http = require("http");

const server = http.createServer(app);

const { Server } = require("socket.io");

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
    },
});

// Online users currently
const onlineUsersMap = new Map();

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // To make all the users able to join the global room
    socket.on("join_global", () => {
        socket.join("global");
    })

    // TO make all users able to leave the global room
    socket.on("leave_global", () => {
        socket.leave("global");
    })

    // Send_user will update the onlineUsersMap
    socket.on("send_user", (userData) => {
        //console.log(userData);
        onlineUsersMap.set(userData._id, { userName: userData.userName, socketId: socket.id });
        //console.log("map: ", onlineUsersMap);
        socket.user = userData._id;
    });

    socket.on("remove_user", (userData) => {
        //console.log(userData);
        onlineUsersMap.delete(userData._id);
        //console.log("map: ", onlineUsersMap);
        delete socket.user;
    });

    // Send_message gets the message from client to socket server
    // then emits the message to the person
    socket.on("send_message", (dataMessage) => {
        //socket.broadcast.emit("receive_message", { text: text, id: socket.id }); // broadcast doesn't send the user the message
        //io.emit("receive_message", { text: data.text, id: socket.id });
        //console.log(data, socket.user);
        //socket.broadcast.emit("receive_message", { message: data.message, id: socket.user });
        //console.log(dataMessage);
        if(dataMessage.to == "global") {
            socket.to("global").emit("receive_message", dataMessage);
        }
        else if(onlineUsersMap.get(dataMessage.to)) {
            socket.to(onlineUsersMap.get(dataMessage.to).socketId).emit("receive_message", dataMessage);
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected...", socket.user);
        onlineUsersMap.delete(socket.user);
        //console.log(onlineUsersMap);
        //socket.broadcast.emit("disconnected_user", `${socket.id} has disconnected.`);
    });
});

const HTTP_PORT = process.env.PORT || 8080; 

app.get("/", (req, res) => {
    res.send("This is working on port 8080 atm...");
});

server.listen(HTTP_PORT, () => {
    console.log("Server is RUNNING!", HTTP_PORT);
});

