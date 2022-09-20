const moment = require("moment");

function formatMessage(username, text) {
    return{
        username,
        text,
        time: moment().format("h:mm a")
    }
}

function getTime(){
    return moment().format("h:mm a");
}

class Message{
    constructor(username, text){
        this.username = username;
        this.text = text;
        this.time = moment().format("h:mm a");;
    }
    username(){
        return this.username;
    }
    text(){
        return this.text;
    }
    time(){
        return this.time;
    }

}

module.exports = {formatMessage, Message, getTime};