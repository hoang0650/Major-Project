const express = require('express')
const app = express();

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = LocalStorage('./scratch');
}


//cors
var cors = require('cors');
app.use(cors());
//Cors enable
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

const http = require('http');
const server = http.Server(app);

const socketIO = require('socket.io');
const { count } = require('../models/chat');
// const io = socketIO(server);

const io = socketIO(server, {
    cors: {
        origins: ['http://localhost:4200'], 
        methods: ["GET", "POST"]
    }
});

const port = process.env.PORT || 6969;

//app chat
let listUserIDOnline = [];
let listUserSocketIO = [];

async function saveToLocal(listUserIDOnline, listUserSocketIO){
    await localStorage.setItem("listUserIDOnline", JSON.stringify(listUserIDOnline));
    await localStorage.setItem("listUserSocketIO", JSON.stringify(listUserSocketIO));
    console.log("save to local");
    getListUserIDOnlineLocal();
    getListUserSocketIOLocal();
}

async function getListUserIDOnlineLocal(){
    let local = await  JSON.parse(localStorage.getItem("listUserIDOnline"));
    console.log("get List User ID Online Local");
    console.log(local);
    return local;
}
 
async function getListUserSocketIOLocal(){
    let local = await JSON.parse(localStorage.getItem("listUserSocketIO"));
    console.log("get List User ID socket Local");
    console.log(local);
    return local;
}

io.on('connection', (socket) => {
    console.log('user connected');
    console.log(socket.id);

    socket.emit("getUserID");

    socket.on("registUserID", async function(userID){
        console.log(typeof(listUserSocketIO));
        console.log(typeof(listUserIDOnline));
        console.log("--- regist user ---")
        listUserSocketIO = await getListUserSocketIOLocal();
        listUserIDOnline = await getListUserIDOnlineLocal();

        console.log(listUserSocketIO);
        console.log(typeof(listUserSocketIO));
        console.log(listUserIDOnline);
        console.log(typeof(listUserIDOnline));
        console.log(userID+"/"+socket.id);

        
        if(listUserSocketIO == null || listUserIDOnline == null){
            listUserSocketIO = [];
            listUserIDOnline = [];
            listUserIDOnline.push(userID);
            listUserSocketIO.push(socket.id);
            console.log("push id "+userID);
            console.log("push sk "+socket.id);
        }else{
            let userIDPos = listUserIDOnline.indexOf(userID);
            console.log(userIDPos);
            if (userIDPos != -1){
                listUserSocketIO.splice(userIDPos, 1);
                listUserIDOnline.splice(userIDPos, 1);
            }
            
            listUserIDOnline.push(userID);
            listUserSocketIO.push(socket.id);
            console.log("pushh id "+userID);
            console.log("pushh sk "+socket.id);
        }
        console.log(listUserSocketIO);
        console.log(listUserIDOnline);
        await saveToLocal(listUserIDOnline, listUserSocketIO);
        socket.to(socket.id).emit("registSucc", "registration successfull");
        console.log("--- end regist user ---")

    });

    socket.emit("message", "new user");

    socket.on('connect_failed', function() {
        console.log("Sorry, there seems to be an issue with the connection!");
    });
    
    socket.on('disconnect', async function () {
        console.log('----------Disconect--------');

        listUserSocketIO = await getListUserSocketIOLocal();
        listUserIDOnline = await getListUserIDOnlineLocal();
        
        if(listUserSocketIO == null || listUserIDOnline == null){
            return;
        }

        let pos = listUserSocketIO.indexOf(socket.id);
        listUserSocketIO.splice(pos, 1);
        listUserIDOnline.splice(pos, 1);

        saveToLocal(listUserIDOnline, listUserSocketIO);
        console.log('-------A user '+socket.id+' disconnected-------');
    });
    
    socket.on('new-message', function(message) {
        console.log("recive "+ message);
        io.emit("message", message);
    });

    socket.on("private-message", async (receiveUserID, roomID, msg) => {
        console.log("--- private message ---")
        listUserSocketIO = await getListUserSocketIOLocal();

        listUserIDOnline = await getListUserIDOnlineLocal();
        
        console.log(listUserSocketIO);
        console.log(listUserIDOnline);
        console.log("socket on private message");
        console.log("get "+receiveUserID+"/"+roomID+"/"+msg);
        let recivePos = listUserIDOnline.indexOf(receiveUserID);
        console.log(recivePos);
        if(recivePos == -1){
            return;
        }
        let reciveSocketID = listUserSocketIO[recivePos];
        console.log(reciveSocketID);
        let senderPos = listUserSocketIO.indexOf(socket.id);
        console.log(senderPos);
        console.log("socket id "+socket.id);
        let senderID = listUserIDOnline[senderPos];
        console.log(senderID);
        
        console.log("socket emit private message");
        console.log(reciveSocketID+"/"+senderID+"/"+roomID+"/"+msg);
        socket.to(reciveSocketID).emit("private-message", senderID, roomID, msg);
        socket.emit("private-message", senderID, roomID, msg);
        console.log("--- end private message ---")

    });
});



server.listen(port, () => {
    console.log(`started on port: ${port}`);
});