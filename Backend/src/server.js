import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import pool from "./config/db.js";
import app from "./app.js";

const PORT = process.env.PORT || 8080;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

io.on("connection", (socket) => {

  
  socket.on("user_online", async (userId) => {
    try {
      if(!userId)return;
      socket.userId = String(userId);
      socket.join(String(userId));

      await pool.query(
        `UPDATE dbusers SET is_online = TRUE, last_seen = NULL WHERE id = $1`,
        [userId]
      );

      io.emit("user_status_changed", {
        userId:String(userId),
        is_online: true,
        last_seen: null,
      });

      
    } catch (error) {
      console.error("Online status error:", error.message);
    }
  });


  socket.on("send_message", async (data) => {
    try {
      const { conversationId, senderId, receiverId, message, messageType = "text", attachmentUrl=null } = data;

      if (!conversationId || !senderId || !receiverId) return;
      if(!message.trim()&&!attachmentUrl) return;
      const result = await pool.query(
        `INSERT INTO messages (conversation_id, sender_id, receiver_id, message, message_type,attachment_url)
         VALUES ($1, $2, $3, $4, $5,$6) RETURNING *`,
        [conversationId, senderId, receiverId, message, messageType,attachmentUrl]
      );

      const newMessage = result.rows[0];

     
      io.to(String(receiverId).emit("receive_message", {
        ...newMessage,
        conversationId: newMessage.conversation_id,
        senderId: newMessage.sender_id,
        receiverId: newMessage.receiver_id,
        messageType:newMessage.message_type,
        attachmentUrl:newMessage.attachment_url
      }));

      
      socket.emit("message_sent", {...newMessage,
        conversationId:newMessage.conversation_id,
      senderId:newMessage.sender_id,
      receiverId:newMessage.receiver_id,
      messageType:newMessage.message_type,
      attachmentUrl:newMessage.attachment_url
    });

    } catch (error) {
      console.log("Send message error:", error.message);
    }
  });
  socket.on("edit_message",async(data)=>
  {
    try{

    
    const{messageId,message,senderId}=data;

    if(!messageId||!message||!senderId){
      return;
    };
    const result = await pool.query(
      `UPDATE  messages SET message = $1 ,is_edited = TRUE,edited_at=CURRENT_TIMESTAMP,updated_at=CURRENT_TIMESTAMP WHERE id = $2 AND sender_id = $3 AND is_deleted = FALSE RETURNING *`,[message,messageId,senderId]
    )
    if(result.rows.length===0)
    {
      return;
    }
    const updatedMessage = result.rows[0];
    io.to(updatedMessage.receiver_id).emit("message_updated",updatedMessage);
    socket.emit("message_updated",updatedMessage)
  }
  catch(error)
  {
    console.error("edit message error",error.message);

  }
})
socket.on("delete_message",async(data)=>
{
  try{
    const{messageId,senderId}=data;
    if(!messageId||!senderId)
    {
      return;
    }
    const result = await pool.query(`UPDATE messages SET message = 'This message was deleted',is_deleted = TRUE,deleted_at=CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND sender_id = $2 AND is_deleted = FALSE RETURNING *`,[messageId,senderId]);
    if(result.rows.length===0)
    {
      return
    }
    const deletedMessage = result.rows[0];
    io.to(deletedMessage.receiver_id).emit("message_deleted",deletedMessage);
    socket.emit("message_deleted",deletedMessage);
  }
  catch(error)
  {
    console.error("Delete message error",error.message)
  }
})
  socket.on("disconnect", async () => {
    try {
      if (!socket.userId) return;
      const userId = String(socket.userId);
      const activeSockets = await io.in(userId).fetchSockets();
      if(activeSockets.length>0)
      {
        console.log("User still connected:",userId,"connections",activeSockets.length);
        return;
      }

      const result = await pool.query(
        `UPDATE dbusers
         SET is_online = FALSE, last_seen = CURRENT_TIMESTAMP
         WHERE id = $1 RETURNING last_seen`,
        [socket.userId]
      );

      io.emit("user_status_changed", {
        userId,
        is_online: false,
        last_seen: result.rows[0]?.last_seen || null,
      });

      console.log("User offline:", userId);

    } catch (error) {
      console.log("Disconnect error:", error.message);
    }
  });
});


const connection = async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log("PostgreSQL connected successfully");

    server.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });

  } catch (error) {
    console.log("Database connection failed:", error.message);
    process.exit(1);
  }
};

connection();