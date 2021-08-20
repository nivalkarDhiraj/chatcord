const socket = io();

//get username and room from url
const { username, room } = Qs.parse(location.search, {
	ignoreQueryPrefix: true,
});

//join chatroom
socket.emit("joinRoom", { username, room });

//get room and Users
socket.on("roomUsers", ({ room, users }) => {
	outputRoomName(room);
	outputUsers(users);
});

const chatMessages = document.querySelector(".chat-messages");
//message from server
socket.on("message", (message) => {
	console.log(message);
	outputMessage(message);

	//scroll down
	chatMessages.scrollTop = chatMessages.scrollHeight;
});

const chatForm = document.getElementById("chat-form");

chatForm.addEventListener("submit", (e) => {
	e.preventDefault();

	const msg = e.target.elements.msg.value;

	//emitting msg to server
	socket.emit("chatMessage", msg);

	//clear the input
	e.target.elements.msg.value = "";
	e.target.elements.msg.focus();
});

//output msg DOM
function outputMessage(message) {
	const div = document.createElement("div");
	div.classList.add("message");
	div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text} 
    </p>`;
	document.querySelector(".chat-messages").appendChild(div);
}

const roomName = document.getElementById("room-name");
//add roomname to DOM
function outputRoomName(room) {
	roomName.innerHTML = room;
}

const userList = document.getElementById("users");
function outputUsers(users) {
	userList.innerHTML = `
	${users.map((user) => `<li>${user.username}</li>`).join('')}
	`;
}
