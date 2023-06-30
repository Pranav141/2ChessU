const express=require('express');
const app=express();
const http=require('http');
const server=http.createServer(app);
const {Server} = require('socket.io')
const cors=require('cors')
// app.use(cors())
app.get('/',(req,res)=>{
    res.send("hello")
})
const io=new Server(server,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"]
    }
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
        console.log(data.username,"is joined",data.room);
        socket.to(data.room).emit("game_joined",({
            type:"game_joined",
            room:data.room,
            username:data.username,
            time:data.time
        }))
    })
    socket.on("send_message",(data)=>{
        socket.to(data.room).emit("receive_message",(data));
    })
    socket.on("disconnect",()=>{
        console.log("User disconnected");
    })
    socket.on("piece_moved",(data)=>{
        console.log(data,"I am in piece moved");
        socket.to(data.room).emit("piece_move_recieve",data.move);
    })
})

server.listen(3001,()=>{
console.log("Server Running on http://localhost:3001");
})