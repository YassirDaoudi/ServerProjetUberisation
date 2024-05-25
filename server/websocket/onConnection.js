const { pool } = require("../models/pg");
const UserSocketMap = require("./socketsUsersMap");

const findUnsentMessagesAndSendThem = (socket) => {
  const user = socket.request.decodedjwt;

  const findUnsent = (user) => {
    const sql = "Select * from messages where receiver = $1 and status = 'sent'";
    return pool.query(sql, [user.id]);
  };
  const sendAll = (data) => {
    const messages = data.rows;
    if (messages.length != 0) socket.emit("messages", messages);
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

  /*on the event "messages" you send 
    
        {
            messages : [
                {},
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
          element.id = data.rows[0].id
          if (UserSocketMap.get(receiver) != undefined) {
            socket.to(UserSocketMap.get(receiver)).emit("messages", element);
          }
        })
        .catch((err) => {
          // ill do error management if i can spare some time i promise
          console.log(err.stack);
        });
    });
  });

};

module.exports = { onConnection };
