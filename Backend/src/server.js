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
  console.log("User connected:", socket.id);

  // USER ONLINE
  socket.on("user_online", async (userId) => {
    try {
      socket.userId = userId;

      // User ke personal room mein join
      socket.join(userId);

      await pool.query(
        `UPDATE dbusers
         SET is_online = TRUE,
             last_seen = NULL
         WHERE id = $1`,
        [userId]
      );

      // Sab connected users ko notify karo
      io.emit("user_status_changed", {
        userId: userId,
        is_online: true,
        last_seen: null,
      });

      console.log("User online:", userId);
    } catch (error) {
      console.error("Online status error:", error.message);
    }
  });

  // SEND MESSAGE
  socket.on("send_message", async (data) => {
    try {
      const {
        conversation_id,
        sender_id,
        receiver_id,
        message,
        message_type = "text",
      } = data;

      if (
        !conversation_id ||
        !sender_id ||
        !receiver_id ||
        !message
      ) {
        return;
      }

      const result = await pool.query(
        `INSERT INTO messages
        (
          conversation_id,
          sender_id,
          receiver_id,
          message,
          message_type
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [
          conversation_id,
          sender_id,
          receiver_id,
          message,
          message_type,
        ]
      );

      const newMessage = result.rows[0];

      // Receiver ko message
      io.to(receiver_id).emit(
        "receiver_message",
        newMessage
      );

      // Sender ko confirmation
      socket.emit(
        "message_sent",
        newMessage
      );

    } catch (error) {
      console.log(
        "Send message error:",
        error.message
      );
    }
  });

  // USER OFFLINE / DISCONNECT
  socket.on("disconnect", async () => {
    try {
      if (!socket.userId) {
        return;
      }

      const result = await pool.query(
        `UPDATE dbusers
         SET is_online = FALSE,
             last_seen = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING last_seen`,
        [socket.userId]
      );

      // Sab connected users ko notify karo
      io.emit("user_status_changed", {
        userId: socket.userId,
        is_online: false,
        last_seen:
          result.rows[0]?.last_seen || null,
      });

      console.log(
        "User offline:",
        socket.userId
      );

    } catch (error) {
      console.log(
        "Disconnect error:",
        error.message
      );
    }
  });
});


// DATABASE + SERVER
const connection = async () => {
  try {
    await pool.query("SELECT NOW()");

    console.log(
      "PostgreSQL connected successfully"
    );

    server.listen(PORT, () => {
      console.log(
        `Server is running on ${PORT}`
      );
    });

  } catch (error) {
    console.log(
      "Database connection failed:",
      error.message
    );

    process.exit(1);
  }
};

connection();