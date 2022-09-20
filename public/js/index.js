const usernameInput = document.getElementById("username");
const userForm = document.getElementById("user-form");
const room = document.getElementById("room");

const socket = io();

userForm.addEventListener("submit", (e) => {

    //prevents default behavior
    e.preventDefault();

    //get the message from text
    const msg = e.target.elements.msg;
  
    console.log(usernameInput.value);

    const name = usernameInput.value;
    const theRoom = room.value;
    const temp = "";

    socket.emit("check-if-name-valid", {name, theRoom, temp});

    console.log(temp);

    /*const name = usernameInput.value;
    const theRoom = room.value;

    socket.emit("join-room", {name, theRoom});*/

    //window.location.href = "chat.html";

});

socket.on("name-taken", () => {
    console.log("hello, name taken");
});

socket.on("name-allowed", () => {
    console.log("yes you can come in");

    const name = usernameInput.value;
    const theRoom = room.value;

    socket.emit("connect-user", ({name, theRoom}));
    window.location.href = "chat.html";

    //window.location.href = "chat.html";
    //window.location.href = `chat.html?username=${name}&room=${theRoom}`;
    //const urlPath = `chat.html?username=${name}&room=${theRoom}`;

    //window.history.replaceState({"html":response.html,"pageTitle":response.pageTitle},"", urlPath);

    //window.history.replaceState('', '', `chat.html?username=${name}&room=${theRoom}`)

    /*const name = usernameInput.value;
    const theRoom = room.value;*/

    //socket.emit("join-room", {name, theRoom});

});