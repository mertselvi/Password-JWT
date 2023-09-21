const express = require('express')
const path = require('path')
const http = require('http')
const app = express();
const socketio = require('socket.io')



const server = http.createServer(app)
const io = socketio(server)
const formatMessage = require('../Chat/utils/messages')
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('../Chat/utils/users')   //Fonksiyon isimleri ile aynı olmalı ki aynı fonskiyonu çalıştırsın


//Set Static Folder
app.use(express.static(path.join(__dirname,'public')))  //Ne sikime yarar bu araştır ?


//Run when client connects
io.on('connection', (socket) => {

    socket.on('joinRoom', ({username,room}) => {
        const user = userJoin (socket.id, username, room);
        socket.join(user.room)

        socket.emit('message', formatMessage("Admin","Welcome Chat"))

        socket.broadcast.to(user.room).emit('message', formatMessage("Admin", `A ${user.username} has joined the chat`))

        //Send User and Room Info 

        io.to(user.room).emit('roomUsers', {
            room : user.room,
            users : getRoomUsers(user.room)
        })
    })
    
    
    //Listen for chat message

    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('message', formatMessage(user.username,msg ))
    })
    

    socket.on('disconnect', ()=>{
        const user = userLeave(socket.id)
        if (user){
        io.to(user.room).emit('message', formatMessage("Admin", `A ${user.username} has left the chat`))
        }

        io.to(user.room).emit('roomUsers', {
            room : user.room,
            users : getRoomUsers(user.room)
        })
    })
})

server.listen (3000, ()=> {            //Neden app yapınca patlıyor bunu öğren
    console.log('Server connected ')
})

