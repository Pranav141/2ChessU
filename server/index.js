const express=require('express');
const app=express();
const http=require('http');
const server=http.createServer(app);
const {Server} = require('socket.io')
const cors=require('cors')
require('dotenv').config()
app.use(cors())
app.get('/',(req,res)=>{
    res.send("hello")
})
const origin=process.env.ORIGIN;
const io=new Server(server,{
    cors:{
        origin:["https://2chessu.vercel.app","http://localhost:3000"],
        methods:["GET","POST"],
        credentials:true
    },
    pingInterval: 30000, pingTimeout: 50000
})
io.on("connection",(socket)=>{
    console.log(socket.id);
    socket.on("create_room",(data)=>{
        socket.join(data.roomID);
        console.log(data.username,"is joined",data.roomID);
    })
    socket.on("check_room",(data)=>{
        const clients = io.sockets.adapter.rooms.get(data.room);
        socket.emit("check_room_1",({exist:clients?.size,room:data.room,username:data.username}));
    })
    socket.on("join_room",(data)=>{
        socket.join(data.room);
        const clients = io.sockets.adapter.rooms.get(data.room);
        if(clients?.size===2){
            io.to(data.room).emit("GAME_PLAYABLE");
        }
        console.log(data.username,"is joined",data.room);
        socket.to(data.room).emit("game_joined",({
            type:"game_joined",
            room:data.room,
            username:data.username,
            time:data.time
        }))
    })
    // socket.on("SEND_PLAYER1_NAME",(data)=>{
    //     socket.emit("SET_PLAYER1_NAME",(data.name));
    // })
    // socket.on("SEND_PLAYER2_NAME",(data)=>{
    //     socket.emit("SET_PLAYER2_NAME",(data.name));
    // })
    socket.on("send_message",(data)=>{
        socket.to(data.room).emit("receive_message",(data));
    })
    socket.on("disconnect",()=>{
        console.log("User disconnected");
    })
    socket.on("piece_moved",(data)=>{
        // console.log(data,"I am in piece moved");
        socket.to(data.room).emit("piece_move_recieve",data.move);
    })
})

server.listen(3001,()=>{
console.log("Server Running on http://localhost:3001");
})