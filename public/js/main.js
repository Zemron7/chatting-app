const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

//Get username and room from URL
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

socket.emit("join-room", {username, room});

socket.on("room-users", ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
});

//on recieve message from server
socket.on("message", message => {
    //console.log(message);
    outputMessage(message);

    //Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on("remove-children", () => {
    chatMessages.innerHTML = '';
});

//Message submit
chatForm.addEventListener("submit", (e) => {
    //prevents default behavior
    e.preventDefault();

    //get the message from text
    const msg = e.target.elements.msg.value;

    //emit the message to the server
    socket.emit("chatMessage", msg);

    //clear input
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();
});

//Output message to DOM
function outputMessage(message){

    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<p class="meta">${message.username}<span> | ${message.time}</span></p><p class="text">${message.text}</p>`;
    document.querySelector('.chat-messages').appendChild(div);

}

//add room name to DOM
function outputRoomName(room){
    roomName.innerText = room;
}

//add users to DOM
function outputUsers(users){
    userList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`;
}
