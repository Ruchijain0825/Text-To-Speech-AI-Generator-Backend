import pool from "../config/db.js";

export const createConversation = async(req,res) =>
{
    try
    {
        const user1_id = req.user?.userId || req.user?.id || req.user?.user_id;
        const {user2_id} = req.body;

        if(!user1_id || !user2_id)
            return res.status(400).json({
                success:false,
                message:"user1_id and user2_id are required"
            });

        if(String(user1_id) === String(user2_id))
            return res.status(400).json({
                success:false,
                message:"You cannot chat with yourself"
            });

        const userCheck = await pool.query(
            `SELECT id,name,email,is_online,last_seen
             FROM public.dbusers WHERE id=$1`,
            [user2_id]
        );

        if(userCheck.rows.length === 0)
            return res.status(404).json({
                success:false,
                message:"Selected user not found"
            });

        const existing = await pool.query(
            `SELECT * FROM public.conversations
             WHERE (user1_id=$1 AND user2_id=$2)
             OR (user1_id=$2 AND user2_id=$1)
             LIMIT 1`,
            [user1_id,user2_id]
        );

        if(existing.rows.length > 0)
            return res.status(200).json({
                success:true,
                existing:true,
                message:"Conversation already exists",
                conversation:existing.rows[0]
            });

        const result = await pool.query(
            `INSERT INTO public.conversations
             (user1_id,user2_id,status)
             VALUES($1,$2,'active')
             RETURNING *`,
            [user1_id,user2_id]
        );

        return res.status(201).json({
            success:true,
            existing:false,
            message:"Conversation created successfully",
            conversation:result.rows[0]
        });
    }
    catch(error)
    {
        console.error("CREATE CONVERSATION ERROR:",error);

        return res.status(500).json({
            success:false,
            message:error.message || "Internal Server Error"
        });
    }
};


export const getUsers = async(req,res) =>
{
    try
    {
        const currentUserId =
            req.user?.userId || req.user?.id || req.user?.user_id;

        if(!currentUserId)
            return res.status(401).json({
                success:false,
                message:"Current user ID not found in token"
            });

        const result = await pool.query(
            `SELECT id,name,email,is_online,last_seen
             FROM public.dbusers
             WHERE id<>$1
             ORDER BY name ASC`,
            [currentUserId]
        );

        return res.status(200).json({
            success:true,
            users:result.rows
        });
    }
    catch(error)
    {
        console.error("GET USERS ERROR:",error);

        return res.status(500).json({
            success:false,
            message:error.message || "Failed to fetch users"
        });
    }
};


export const getMessages = async(req,res) =>
{
    try
    {
        const {conversationId} = req.params;
        const currentUserId =
            req.user?.userId || req.user?.id || req.user?.user_id;

        if(!conversationId)
            return res.status(400).json({
                success:false,
                message:"Conversation ID is required"
            });

        const conversation = await pool.query(
            `SELECT * FROM public.conversations
             WHERE id=$1 AND (user1_id=$2 OR user2_id=$2)`,
            [conversationId,currentUserId]
        );

        if(conversation.rows.length === 0)
            return res.status(403).json({
                success:false,
                message:"You are not part of this conversation"
            });

        const result = await pool.query(
            `SELECT id,conversation_id,sender_id,receiver_id,message,
                    message_type,attachment_url,sent_at,delivered_at,
                    read_at,is_edited,edited_at,is_deleted,deleted_at,
                    reply_to_id,created_at,updated_at
             FROM public.messages
             WHERE conversation_id=$1
             ORDER BY created_at ASC`,
            [conversationId]
        );

        return res.status(200).json({
            success:true,
            messages:result.rows
        });
    }
    catch(error)
    {
        console.error("GET MESSAGES ERROR:",error);

        return res.status(500).json({
            success:false,
            message:error.message || "Failed to fetch messages"
        });
    }
};


export const getConversationHistory = async(req,res) =>
{
    try
    {
        const currentUserId =
            req.user?.userId || req.user?.id || req.user?.user_id;

        if(!currentUserId)
            return res.status(401).json({
                success:false,
                message:"Current user ID not found"
            });

        const result = await pool.query(
            `SELECT
                c.id AS conversation_id,
                c.user1_id,
                c.user2_id,
                c.status,
                c.created_at,
                c.updated_at,

                CASE WHEN c.user1_id=$1
                    THEN u2.id ELSE u1.id END AS other_user_id,

                CASE WHEN c.user1_id=$1
                    THEN u2.name ELSE u1.name END AS other_user_name,

                CASE WHEN c.user1_id=$1
                    THEN u2.email ELSE u1.email END AS other_user_email,

                m.message AS last_message,
                m.message_type AS last_message_type,
                m.sent_at AS last_message_time

             FROM public.conversations c
             JOIN public.dbusers u1 ON u1.id=c.user1_id
             JOIN public.dbusers u2 ON u2.id=c.user2_id

             LEFT JOIN LATERAL(
                SELECT message,message_type,sent_at
                FROM public.messages
                WHERE conversation_id=c.id
                ORDER BY created_at DESC
                LIMIT 1
             ) m ON true

             WHERE c.user1_id=$1 OR c.user2_id=$1
             ORDER BY COALESCE(
                m.sent_at,c.updated_at,c.created_at
             ) DESC`,
            [currentUserId]
        );

        return res.status(200).json({
            success:true,
            conversations:result.rows
        });
    }
    catch(error)
    {
        console.error("GET CONVERSATION HISTORY ERROR:",error);

        return res.status(500).json({
            success:false,
            message:error.message || "Failed to fetch conversation history"
        });
    }
};


export const saveConversation = async(req,res) =>
{
    try
    {
        const currentUserId =
            req.user?.userId || req.user?.id || req.user?.user_id;

        const {conversationId} = req.body;

        if(!currentUserId)
            return res.status(401).json({
                success:false,
                message:"Current user ID not found"
            });

        if(!conversationId)
            return res.status(400).json({
                success:false,
                message:"Conversation ID is required"
            });

        const conversationCheck = await pool.query(
            `SELECT id FROM public.conversations
             WHERE id=$1 AND (user1_id=$2 OR user2_id=$2)`,
            [conversationId,currentUserId]
        );

        if(conversationCheck.rows.length === 0)
            return res.status(403).json({
                success:false,
                message:"You are not part of this conversation"
            });

        const existing = await pool.query(
            `SELECT * FROM public.saved_conversations
             WHERE user_id=$1 AND conversation_id=$2`,
            [currentUserId,conversationId]
        );

        if(existing.rows.length > 0)
            return res.status(200).json({
                success:true,
                saved:true,
                message:"Conversation already saved"
            });

        await pool.query(
            `INSERT INTO public.saved_conversations
             (user_id,conversation_id)
             VALUES($1,$2)`,
            [currentUserId,conversationId]
        );

        return res.status(201).json({
            success:true,
            saved:true,
            message:"Conversation saved successfully"
        });
    }
    catch(error)
    {
        console.error("SAVE CONVERSATION ERROR:",error);

        return res.status(500).json({
            success:false,
            message:error.message || "Failed to save conversation"
        });
    }
};


export const unsaveConversation = async(req,res) =>
{
    try
    {
        const currentUserId =
            req.user?.userId || req.user?.id || req.user?.user_id;

        const {conversationId} = req.params;

        if(!currentUserId)
            return res.status(401).json({
                success:false,
                message:"Current user ID not found"
            });

        if(!conversationId)
            return res.status(400).json({
                success:false,
                message:"Conversation ID is required"
            });

        await pool.query(
            `DELETE FROM public.saved_conversations
             WHERE user_id=$1 AND conversation_id=$2`,
            [currentUserId,conversationId]
        );

        return res.status(200).json({
            success:true,
            saved:false,
            message:"Conversation removed from saved"
        });
    }
    catch(error)
    {
        console.error("UNSAVE CONVERSATION ERROR:",error);

        return res.status(500).json({
            success:false,
            message:error.message || "Failed to unsave conversation"
        });
    }
};


export const checkSavedConversation = async(req,res) =>
{
    try
    {
        const currentUserId =
            req.user?.userId || req.user?.id || req.user?.user_id;

        const {conversationId} = req.params;

        if(!currentUserId)
            return res.status(401).json({
                success:false,
                message:"Current user ID not found"
            });

        const result = await pool.query(
            `SELECT 1 FROM public.saved_conversations
             WHERE user_id=$1 AND conversation_id=$2
             LIMIT 1`,
            [currentUserId,conversationId]
        );

        return res.status(200).json({
            success:true,
            saved:result.rows.length > 0
        });
    }
    catch(error)
    {
        console.error("CHECK SAVED ERROR:",error);

        return res.status(500).json({
            success:false,
            message:error.message || "Failed to check saved conversation"
        });
    }
};


export const getSavedConversations = async(req,res) =>
{
    try
    {
        const currentUserId =
            req.user?.userId || req.user?.id || req.user?.user_id;

        if(!currentUserId)
            return res.status(401).json({
                success:false,
                message:"Current user ID not found"
            });

        const result = await pool.query(
            `SELECT
                sc.conversation_id,
                sc.created_at AS saved_at,
                c.created_at,
                c.updated_at,

                CASE WHEN c.user1_id=$1
                    THEN u2.id ELSE u1.id END AS other_user_id,

                CASE WHEN c.user1_id=$1
                    THEN u2.name ELSE u1.name END AS other_user_name,

                CASE WHEN c.user1_id=$1
                    THEN u2.email ELSE u1.email END AS other_user_email,

                m.message AS last_message,
                m.message_type AS last_message_type,
                m.sent_at AS last_message_time

             FROM public.saved_conversations sc

             JOIN public.conversations c
                ON c.id=sc.conversation_id

             JOIN public.dbusers u1
                ON u1.id=c.user1_id

             JOIN public.dbusers u2
                ON u2.id=c.user2_id

             LEFT JOIN LATERAL(
                SELECT message,message_type,sent_at
                FROM public.messages
                WHERE conversation_id=c.id
                ORDER BY created_at DESC
                LIMIT 1
             ) m ON true

             WHERE sc.user_id=$1
             ORDER BY sc.created_at DESC`,
            [currentUserId]
        );

        return res.status(200).json({
            success:true,
            conversations:result.rows
        });
    }
    catch(error)
    {
        console.error("GET SAVED CONVERSATIONS ERROR:",error);

        return res.status(500).json({
            success:false,
            message:error.message || "Failed to fetch saved conversations"
        });
    }
};