const path = require('path');
const express = require('express');
const http = require('http'); 
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Run when client connects
io.on('connection', socket => {
    console.log("New web socket connection...");

    //welcome current user
    socket.emit("message", "welcome to chatcord");

    //brodcast when a user connects to all clients except the client is conecting
    socket.broadcast.emit("message", "A user has joined the chat");

    socket.on("disconnect",() =>{
        io.emit("message", "A user has left the chat");
    })

    //listen for chatMessage
    socket.on("chatMessage", msg =>{
        io.emit("message", msg);
    })

    // //to all the clients
    // io.emit();
})

const PORT = process.env.PORT || 3000;

server.listen(PORT, () =>{
    console.log("server listening on", PORT);
})