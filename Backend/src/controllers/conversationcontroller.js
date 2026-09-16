import pool from "../config/db.js";

export const createConversation = async (req, res) => {
  try {
    // Logged-in user JWT se
    const dbInfo = await pool.query(`
  SELECT
    current_database() AS database,
    current_schema() AS schema
`);

console.log("DATABASE INFO:", dbInfo.rows[0]);

const tableCheck = await pool.query(`
  SELECT
    table_schema,
    table_name
  FROM information_schema.tables
  WHERE table_name = 'conversations'
`);

console.log("CONVERSATIONS TABLE:", tableCheck.rows);
    const user1_id = req.user.userId;

    // Frontend se selected user
    const { user2_id } = req.body;

    console.log("user1_id:", user1_id);
    console.log("user2_id:", user2_id);

    // Check IDs
    if (!user1_id || !user2_id) {
      return res.status(400).json({
        success: false,
        message: "user1_id and user2_id are required",
      });
    }

    // Same user check
    if (user1_id === user2_id) {
      return res.status(400).json({
        success: false,
        message: "You cannot create a conversation with yourself",
      });
    }

    // Check selected user exists
    const userCheck = await pool.query(
      `SELECT id
       FROM public.dbusers
       WHERE id = $1`,
      [user2_id]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check whether conversation already exists
    const existingConversation = await pool.query(
      `SELECT *
       FROM public.conversations
       WHERE
         (user1_id = $1 AND user2_id = $2)
         OR
         (user1_id = $2 AND user2_id = $1)
       LIMIT 1`,
      [user1_id, user2_id]
    );

    // Already exists
    if (existingConversation.rows.length > 0) {
      console.log(
        "Conversation already exists:",
        existingConversation.rows[0]
      );

      return res.status(200).json({
        success: true,
        message: "Conversation already exists",
        conversation: existingConversation.rows[0],
      });
    }

    // Create new conversation
    const result = await pool.query(
      `INSERT INTO public.conversations
       (user1_id, user2_id)
       VALUES ($1, $2)
       RETURNING *`,
      [user1_id, user2_id]
    );

    console.log(
      "Conversation created:",
      result.rows[0]
    );

    return res.status(201).json({
      success: true,
      message: "Conversation created successfully",
      conversation: result.rows[0],
    });

  } catch (error) {
    console.error(
      "Create Conversation Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


// GET ALL OTHER USERS
export const getUsers = async (req, res) => {
  try {
    const currentUserId = req.user.userId;

    console.log(
      "Current logged in user:",
      currentUserId
    );

    if (!currentUserId) {
      return res.status(400).json({
        success: false,
        message: "No user found",
      });
    }

    const result = await pool.query(
      `SELECT
          id,
          name,
          email,
          is_online,
          last_seen
       FROM public.dbusers
       WHERE id <> $1
       ORDER BY name ASC`,
      [currentUserId]
    );

    console.log(
      "Users fetched:",
      result.rows.length
    );

    return res.status(200).json({
      success: true,
      users: result.rows,
    });

  } catch (error) {
    console.error(
      "Get Users Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};