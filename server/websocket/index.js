const { Server } = require("socket.io");
const { jwtCheck } = require("./jwtCheck");
const { onConnection } = require("./onConnection");

module.exports = (server)=>{
    const io = new Server(server)

    io.use(jwtCheck)
    io.on("connection",onConnection)
// need to add on disconnect to clean up the hashh map

}