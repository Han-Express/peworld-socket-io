import { Server } from "socket.io";

const port = process.env.PORT || 3001 

const io = new Server({
    cors: {
        origin: ["http://localhost:3000", "https://han-express-peworld.netlify.app"]
    }
});

let onlineUsers = [];

const addnewUser = (userId, socketId) => {
    // onlineUsers.some((user)=> user.userId === userId) && 
    //     onlineUsers.filter((user) => user.userId !== userId)
    onlineUsers.some((user)=> user.userId === userId) ?
    onlineUsers.forEach((user, index) => {
        user.userId === userId &&
        onlineUsers.splice(index, 1, {userId, socketId})  
    }) :
    onlineUsers.push({userId, socketId})


}

const removeUser = (socketId) => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId)
}

const getUser = (userId) => {
    return onlineUsers.find((user) => user.userId == userId)
}



io.on("connection", (socket) => {    
    
    console.log("conected")
    
    socket.on("newUser", (userId) => {
        addnewUser(userId, socket.id)
        
        console.log(onlineUsers)
    })

    socket.on("sendMessage", ({user, receiverId, message, header}) => {
        const receiver = getUser(receiverId);
        console.log(receiver)
        console.log(user)
        io.to(receiver?.socketId).emit("getMessage", {
            user,
            message, 
            header,
            receiverId
        })
    })


  socket.on("disconnect", () => {
    removeUser(socket.id)
    console.log("someonehas disconnected")
  })
});

io.listen(port);