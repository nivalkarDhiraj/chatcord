const socket = io();

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

    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();
});

//output msg DOM
function outputMessage(message) {
	const div = document.createElement("div");
	div.classList.add("message");
	div.innerHTML = `<p class="meta">Brad <span>9:12pm</span></p>
    <p class="text">
        ${message} 
    </p>`;
	document.querySelector(".chat-messages").appendChild(div);
}