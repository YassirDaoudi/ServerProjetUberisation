const { pool } = require("../models/pg");
const UserSocketMap = require("./socketsUsersMap");
const { onDisconnect } = require("./onDisconnect");

const findUnsentMessagesAndSendThem = (socket) => {
    const user = socket.request.decodedjwt;

    const findUnsent = (user) => {
        const sql =
            "Select * from messages where receiver = $1 and status = 'sent'";
        return pool.query(sql, [user.id]);
    };
    const sendAll = (data) => {
        const messages = data.rows.map((message)=>{
            try {
                let pr = JSON.parse(message.content)
                message.projectRequest = pr
                return message
            } catch (error) {
                return message
            }
        })
        
        if (messages.length != 0) socket.emit("messages", messages);
    };
    findUnsent(user)
        .then(sendAll)
        .catch((err) => console.log(err.stack));
};
const findUnsentAcksAndSendThem = (socket) => {
    const user = socket.request.decodedjwt;

    const findUnsent = (user) => {
        const sql =
            "Select * from messages where sender = $1 and id in (select message_id from unsent_updates )";
        return pool.query(sql, [user.id]);
    };
    const sendAll = (data) => {
        const messages = data.rows;
        if (messages.length != 0) {
            socket.emit("msg_status", messages.map((message) => {
                return {
                    id: message.id,
                    disc_id: message.disc_id,
                    status: message.status
                }
            }));
        }
        // delete from unsent table
        let sql = "DELETE FROM unsent_updates where message_id in (SELECT id FROM messages WHERE sender =$1 ) "
        pool.query(sql,[user.id])
    };
    findUnsent(user)
        .then(sendAll)
        .catch((err) => console.log(err.stack));
};


const onConnection = (socket) => {
    const user = socket.request.decodedjwt;
    UserSocketMap.set(user.id, socket.id);

    /**
     * once after each connection query db to find unsent messages then send them
     */

    findUnsentMessagesAndSendThem(socket);
    findUnsentAcksAndSendThem(socket);

    /*on the event "messages" you send 
        
            {
                messages : [
                    {
                        content : "",
                        disc_id : number
                    },
                    {},
                    .
                    .
                    .
                ]
            }
        
        */
    socket.on("messages", (sent_messages) => {
        const sender = user.id;

        sent_messages.messages.forEach((element) => {
            console.log("pppp");
            // do some checking here like if the sender is allowed to message the receiver
            //also check for missing fields in the message object
            let disc_id = element.disc_id;
            let getDiscussionSql = "SELECT * FROM discussions where id=$1";
            pool
                .query(getDiscussionSql, [disc_id])
                .then((data) => {
                    let result = data.rows[0];
                    if (result == undefined) {
                        return new Promise((resolve, reject) => {
                            reject(new Error("no such discussion"));
                        });
                    }

                    let receiver;

                    if (user.usertype == "client") {
                        receiver = result.designer_id;
                    } else {
                        receiver = result.client_id;
                    }
                    let insertMessagesIntoDbSQL =
                        "INSERT INTO messages (content,timestamp,disc_id,sender,receiver,status) VALUES ($1,$2,$3,$4,$5,$6) Returning id,receiver";
                    return pool.query(insertMessagesIntoDbSQL, [
                        element.content,
                        Date.now(),
                        element.disc_id,
                        sender,
                        receiver,
                        "sent",
                    ]);
                })

                .then((data) => {
                    let receiver = data.rows[0].receiver;
                    element.id = data.rows[0].id;
                    try {
                        let pr = JSON.parse(element.content)
                        element.projectRequest = pr
                    } catch (error) {
                    }
                    if (UserSocketMap.get(receiver) != undefined) {
                        socket.to(UserSocketMap.get(receiver)).emit("messages", [element]);
                    }
                })
                .catch((err) => {
                    // ill do error management if i can spare some time i promise
                    console.log(err.stack);
                });
        });
    });




    /**On msg_status event you send
       * {
                messages : [
                    {
                        id : ,
                        status : 
                    },
                    {},
                    .
                    .
                    .
                ]
            }
       */
    socket.on("msg_status", (data) => {
        const statuses = data.messages; // array

        if (statuses.length != 0) {
            statuses.forEach((element) => {
                // should check if empty and authorization
                const sql = "UPDATE messages SET status = $1 where id=$2 and receiver=$3 and status < $1 Returning status,sender,disc_id "
                pool.query(sql, [element.status, element.id, user.id])
                    .then((res) => {
                        if (res.rowCount != 0) {
                            console.log("successfully updated msg status now sending confirmation to id  :" + res.rows[0].sender);
                            if (UserSocketMap.get(res.rows[0].sender) == undefined) {
                                console.log("id : " + res.rows[0].sender + " not online");
                                let sql = "INSERT INTO unsent_updates VALUES ($1)"
                                pool.query(sql, [element.id])
                            } else {
                                socket.to(UserSocketMap.get(res.rows[0].sender)).emit('msg_status', { id: element.id, status: res.rows[0].status, disc_id: res.rows[0].disc_id })
                            }
                        }
                    })
            });
        }
    });
    socket.on("disconnect",()=>{
        onDisconnect(socket)
    })
};

module.exports = { onConnection };
