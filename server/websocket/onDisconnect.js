const UserSocketMap = require("./socketsUsersMap");

const onDisconnect = (socket)=>{
    const user = socket.request.decodedjwt;
    UserSocketMap.delete(user.id)
}
module.exports = {onDisconnect}