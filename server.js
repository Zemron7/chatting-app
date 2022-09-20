//currently using this tutorial: https://www.youtube.com/watch?v=jD7FnbI76Hg

//requiring dependancies
const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const {formatMessage, Message, getTime} = require("./utils/messages");
const {userJoin, getCurrentUser, userLeave, getRoomUsers, checkIfNameTaken} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

var messageHistory = [];
const maxMessages = 200;

//set up static folder
app.use(express.static(path.join(__dirname, "public")));

//name of the server bot
const botName = "Official Bot";

//Run when client connects
io.on("connection", socket => {

    socket.on("connect-user", ({username, room}) => {
        const user = userJoin(socket.id, username, room);

        console.log("I have come here");
    });

    socket.on("join-room", ({username, room}) => {

        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        /*for(let msg in messageHistory){
            io.to(user.room).emit("message", msg);
        }*/

        for(let i = 0; i < messageHistory.length; i++){
            io.to(user.room).emit("message", messageHistory[i]);
        }

        //Welcome current user
        //socket.emit("message", formatMessage(botName, "Welcome to Chatting App!"));
        socket.emit("message", new Message(botName, "Welcome to Chatting App!", getTime()));

        //broadcast when a user connects to everyone but the user
        //formatMessage(botName, `${user.username} has joined the chat`)
        const tempJoinMsg = new Message(botName, `${user.username} has joined the chat`)
        //messageHistory.push(tempJoinMsg);
        socket.broadcast.to(user.room).emit("message", tempJoinMsg);
    
        //send users and room info
        io.to(user.room).emit("room-users", {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });
    
    //listen for a chat message
    socket.on("chatMessage", msg => {
        const user = getCurrentUser(socket.id);

        //const tempMess = new Message(formatMessage(user.username, msg));

        //console.log(user);

        const tempMess = new Message(user.username, msg);

        messageHistory.push(tempMess);

        io.to(user.room).emit("message", tempMess);

        checkForMessageClear(socket);

        /*const user = getCurrentUser(socket.id);

        io.to(user.room).emit("message", formatMessage(user.username, msg));*/
    });

    //runs when the client disconnects
    socket.on("disconnect", () => {
        const kickedUser = userLeave(socket.id);
        
        //checks if the user has been successfully kicked
        if(kickedUser){
            //checkForMessageClear(socket);
            //not going to push join and leave messages
            const tempLeaveMsg = new Message(botName, `${kickedUser.username} has left the chat`)
            //messageHistory.push(tempLeaveMsg);
            //io.to(kickedUser.room).emit("message", formatMessage(botName, `${kickedUser.username} has left the chat`));
            
            io.to(kickedUser.room).emit("message", tempLeaveMsg);
            
            //send users and room info
            io.to(kickedUser.room).emit("room-users", {
                room: kickedUser.room,
                users: getRoomUsers(kickedUser.room)
            });
        
        }

        

    });

    socket.on("check-if-name-valid", ({username, roomId, truth}) => {
        

        if(checkIfNameTaken(username, roomId)){
            io.to(socket.id).emit("name-taken");
        }
        else{
            io.to(socket.id).emit("name-allowed");
        }

        
    })

});

function checkForMessageClear(socket){
    if(messageHistory.length > maxMessages){
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit("remove-children");
        messageHistory = [];
        io.to(user.room).emit("message", new Message(botName, `The ${user.room} Chat Room has exceeded maximum amount of messages (${maxMessages})! The chat has been cleared.`));
    }
}

//setting up flexible port
const PORT = 5000 || process.env.PORT;

//listening at PORT
server.listen(PORT, () => console.log(`Server running at ${PORT}`));