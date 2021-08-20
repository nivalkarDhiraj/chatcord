const path = require("path");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require("./utils/users");
const { get } = require("mongoose");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set static folder
app.use(express.static(path.join(__dirname, "public")));
const botName = "chatCord Bot";

//Run when client connects
io.on("connection", (socket) => {
	console.log("New web socket connection...");
	socket.on("joinRoom", ({ username, room }) => {
		const user = userJoin(socket.id, username, room);
		socket.join(user.room);

		//welcome current user
		socket.emit("message", formatMessage(botName, `Hi ${user.username}, welcome to chatcord`));

		//brodcast when a user connects to all clients except the client is conecting
		socket.broadcast
			.to(user.room)
			.emit("message", formatMessage(botName, `${user.username} has joined the chat`));

		//send users and room info
		io.to(user.room).emit("roomUsers", {
			room: user.room,
			users: getRoomUsers(user.room),
		});
	});

	//disconnection
	socket.on("disconnect", () => {
		const user = userLeave(socket.id);
		if (user) {
			io.to(user.room).emit(
				"message",
				formatMessage(botName, `${user.username} has left the chat`)
			);
            
			//send users and room info
			io.to(user.room).emit("roomUsers", {
				room: user.room,
				users: getRoomUsers(user.room),
			});
		}
	});

	//listen for chatMessage
	socket.on("chatMessage", (msg) => {
		const user = getCurrentUser(socket.id);
		io.to(user.room).emit("message", formatMessage(user.username, msg));
	});

	// //to all the clients
	// io.emit();
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
	console.log("server listening on", PORT);
});
