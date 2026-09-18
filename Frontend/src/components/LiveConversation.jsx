import { useEffect, useState } from "react";

import {
    getUsers,
    getMessages,
    createConversation,
    saveConversation,
    unsaveConversation,
    checkSavedConversation
} from "../apis/Conversation.api";

import { toast } from "react-hot-toast";
import { Star } from "lucide-react";

import socket from "../socket";


const LiveConversation = () => {

    const [users, setUsers] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    const [selectedUser, setSelectedUser] =
        useState(null);

    const [selectedConversation, setSelectedConversation] =
        useState(null);

    const [messages, setMessages] =
        useState([]);

    const [message, setMessage] =
        useState("");

    const [messagesLoaded, setMessagesLoaded] =
        useState(false);

    const [openMenuId, setOpenMenuId] =
        useState(null);

    const [editMessageId, setEditMessageId] =
        useState("");

    const [editMessage, setEditMessage] =
        useState("");

    const [selectedFile, setSelectedFile] =
        useState(null);

    const [isUploading, setIsUploading] =
        useState(false);

    const [isSaved, setIsSaved] =
        useState(false);

    const [isSaving, setIsSaving] =
        useState(false);


    /* =====================================================
       CURRENT USER
    ===================================================== */

    const getCurrentUser = () => {

        try {

            const token =
                localStorage.getItem("accessToken");

            if (!token) return null;

            const payload =
                JSON.parse(
                    atob(token.split(".")[1])
                );

            return (
                payload.id ||
                payload.userId ||
                payload.user_id ||
                payload.sub ||
                null
            );

        } catch (error) {

            console.error(
                "CURRENT USER ERROR:",
                error
            );

            return null;
        }
    };


    const currentUserId =
        getCurrentUser();


    /* =====================================================
       FORMAT MESSAGE
    ===================================================== */

    const formatMessage = (msg) => ({
        ...msg,

        conversationId:
            msg.conversationId ??
            msg.conversation_id,

        senderId:
            msg.senderId ??
            msg.sender_id,

        receiverId:
            msg.receiverId ??
            msg.receiver_id,

        createdAt:
            msg.createdAt ??
            msg.created_at ??
            msg.sent_at,

        messageType:
            msg.messageType ??
            msg.message_type ??
            "text",

        attachmentUrl:
            msg.attachmentUrl ??
            msg.attachment_url ??
            null,

        isEdited:
            msg.isEdited ??
            msg.is_edited ??
            false,

        isDeleted:
            msg.isDeleted ??
            msg.is_deleted ??
            false
    });


    /* =====================================================
       SAVE CHAT
    ===================================================== */

    const saveChatLocally = (
        conversationId,
        chatMessages
    ) => {

        if (!conversationId) return;

        localStorage.setItem(
            `messages_${conversationId}`,
            JSON.stringify(chatMessages)
        );
    };


    /* =====================================================
       RESTORE LAST CHAT
    ===================================================== */

    useEffect(() => {

        if (isLoading) return;

        const restoreChat = async () => {

            try {

                const savedConversation =
                    localStorage.getItem(
                        "selectedConversation"
                    );

                if (!savedConversation) {
                    setMessagesLoaded(true);
                    return;
                }


                const conversation =
                    JSON.parse(
                        savedConversation
                    );


                if (!conversation?.id) {
                    setMessagesLoaded(true);
                    return;
                }


                /*
                   IMPORTANT:

                   Don't depend on saved selectedUser.

                   Find the user again from current users.
                */

                const participantId =
                    String(conversation.user1_id) ===
                    String(currentUserId)
                        ? conversation.user2_id
                        : conversation.user1_id;


                const user =
                    users.find(
                        (item) =>
                            String(item.id) ===
                            String(participantId)
                    );


                if (!user) {

                    console.log(
                        "Saved chat participant not found in users",
                        participantId
                    );

                    localStorage.removeItem(
                        "selectedConversation"
                    );

                    localStorage.removeItem(
                        "selectedUser"
                    );

                    setMessagesLoaded(true);

                    return;
                }


                setSelectedConversation(
                    conversation
                );

                setSelectedUser(user);

                try {
                    const savedResponse =
                        await checkSavedConversation(
                            conversation.id
                        );

                    setIsSaved(
                        savedResponse?.saved || false
                    );
                } catch (error) {
                    console.error(
                        "CHECK SAVED ERROR:",
                        error
                    );
                    setIsSaved(false);
                }


                /*
                   First load local cache
                */

                const savedMessages =
                    localStorage.getItem(
                        `messages_${conversation.id}`
                    );


                if (savedMessages) {

                    try {

                        const localMessages =
                            JSON.parse(
                                savedMessages
                            );

                        setMessages(
                            localMessages.map(
                                formatMessage
                            )
                        );

                    } catch {
                        console.log(
                            "Invalid local messages"
                        );
                    }
                }


                /*
                   Then ALWAYS load DB.
                   DB is source of truth.
                */

                const response =
                    await getMessages(
                        conversation.id
                    );


                const dbMessages =
                    (
                        response?.messages ||
                        []
                    ).map(formatMessage);


                setMessages(dbMessages);

                saveChatLocally(
                    conversation.id,
                    dbMessages
                );

                setMessagesLoaded(true);

            } catch (error) {

                console.error(
                    "RESTORE CHAT ERROR:",
                    error
                );

                setMessagesLoaded(true);
            }
        };


        restoreChat();

    }, [isLoading, users]);


    /* =====================================================
       SAVE MESSAGES WHEN CHANGED
    ===================================================== */

    useEffect(() => {

        if (
            !selectedConversation ||
            !messagesLoaded
        ) {
            return;
        }

        saveChatLocally(
            selectedConversation.id,
            messages
        );

    }, [
        messages,
        selectedConversation,
        messagesLoaded
    ]);


    /* =====================================================
       FETCH USERS
    ===================================================== */

    useEffect(() => {

        const loadUsers = async () => {

            try {

                const response =
                    await getUsers();

                console.log(
                    "USERS:",
                    response
                );

                setUsers(
                    response?.users || []
                );

            } catch (error) {

                console.error(
                    "GET USERS ERROR:",
                    error
                );

                toast.error(
                    "Failed to load users"
                );

            } finally {

                setIsLoading(false);
            }
        };


        loadUsers();

    }, []);


    /* =====================================================
       SOCKET RECEIVE MESSAGE
    ===================================================== */

    useEffect(() => {

        const handleReceiveMessage = (
            data
        ) => {

            const formatted =
                formatMessage(data);


            if (
                selectedConversation &&
                String(
                    formatted.conversationId
                ) !==
                String(
                    selectedConversation.id
                )
            ) {
                return;
            }


            setMessages((prev) => {

                /*
                   Remove temporary local message
                   if DB message has same content.
                */

                const withoutTemp =
                    prev.filter(
                        (msg) =>
                            !(
                                String(msg.id)
                                    .startsWith(
                                        "local-"
                                    ) &&
                                String(
                                    msg.message
                                ) ===
                                String(
                                    formatted.message
                                )
                            )
                    );


                const alreadyExists =
                    withoutTemp.some(
                        (msg) =>
                            String(msg.id) ===
                            String(formatted.id)
                    );


                if (alreadyExists) {
                    return withoutTemp;
                }


                return [
                    ...withoutTemp,
                    formatted
                ];
            });

        };


        socket.on(
            "receive_message",
            handleReceiveMessage
        );


        return () => {

            socket.off(
                "receive_message",
                handleReceiveMessage
            );
        };

    }, [selectedConversation]);


    /* =====================================================
       USER STATUS
    ===================================================== */

    useEffect(() => {

        const handleStatus = (data) => {

            setUsers((prev) =>
                prev.map((user) =>
                    String(user.id) ===
                    String(data.userId)
                        ? {
                              ...user,
                              is_online:
                                  data.is_online ??
                                  data.isOnline ??
                                  false,
                              last_seen:
                                  data.last_seen
                          }
                        : user
                )
            );


            setSelectedUser((prev) =>
                prev &&
                String(prev.id) ===
                    String(data.userId)
                    ? {
                          ...prev,
                          is_online:
                              data.is_online ??
                              data.isOnline ??
                              false,
                          last_seen:
                              data.last_seen
                      }
                    : prev
            );
        };


        socket.on(
            "user_status_changed",
            handleStatus
        );


        return () => {

            socket.off(
                "user_status_changed",
                handleStatus
            );
        };

    }, []);


    /* =====================================================
       EDIT EVENT
    ===================================================== */

    useEffect(() => {

        const handleEditedMessage = (
            updatedMessage
        ) => {

            const formatted =
                formatMessage(
                    updatedMessage
                );


            setMessages((prev) =>
                prev.map((msg) =>
                    String(msg.id) ===
                    String(formatted.id)
                        ? {
                              ...msg,
                              ...formatted
                          }
                        : msg
                )
            );


            setEditMessageId("");
            setEditMessage("");
            setOpenMenuId(null);
        };


        socket.on(
            "message_updated",
            handleEditedMessage
        );


        return () => {

            socket.off(
                "message_updated",
                handleEditedMessage
            );
        };

    }, []);


    /* =====================================================
       DELETE EVENT
    ===================================================== */

    useEffect(() => {

        const handleDeletedMessage = (
            deletedMessage
        ) => {

            setMessages((prev) =>
                prev.map((msg) =>
                    String(msg.id) ===
                    String(deletedMessage.id)
                        ? {
                              ...msg,
                              message:
                                  "This message was deleted",
                              isDeleted: true,
                              is_deleted: true
                          }
                        : msg
                )
            );

            setOpenMenuId(null);
        };


        socket.on(
            "message_deleted",
            handleDeletedMessage
        );


        return () => {

            socket.off(
                "message_deleted",
                handleDeletedMessage
            );
        };

    }, []);


    /* =====================================================
       SAVE / UNSAVE CONVERSATION
    ===================================================== */

    const handleToggleSave = async () => {
        if (!selectedConversation?.id) {
            toast.error("No conversation selected");
            return;
        }

        try {
            setIsSaving(true);

            if (isSaved) {
                await unsaveConversation(
                    selectedConversation.id
                );

                setIsSaved(false);

                toast.success(
                    "Conversation removed from saved"
                );
            } else {
                await saveConversation(
                    selectedConversation.id
                );

                setIsSaved(true);

                toast.success(
                    "Conversation saved ⭐"
                );
            }
        } catch (error) {
            console.error(
                "SAVE CONVERSATION ERROR:",
                error
            );

            toast.error(
                error.message ||
                "Failed to update saved conversation"
            );
        } finally {
            setIsSaving(false);
        }
    };


    /* =====================================================
       OPEN USER CHAT
    ===================================================== */

    const handleClickUser = async (
        user
    ) => {

        try {

            if (!user?.id) {
                toast.error(
                    "Invalid user"
                );
                return;
            }


            const response =
                await createConversation(
                    user.id
                );


            const conversation =
                response?.conversation;


            if (!conversation?.id) {
                throw new Error(
                    "Conversation ID missing"
                );
            }


            setSelectedUser(user);

            setSelectedConversation(
                conversation
            );

            setIsSaved(false);

            setMessages([]);

            setMessagesLoaded(false);

            setOpenMenuId(null);

            try {
                const savedResponse =
                    await checkSavedConversation(
                        conversation.id
                    );

                setIsSaved(
                    savedResponse?.saved || false
                );
            } catch (error) {
                console.error(
                    "CHECK SAVED ERROR:",
                    error
                );
                setIsSaved(false);
            }


            /*
               SAVE immediately.
            */

            localStorage.setItem(
                "selectedConversation",
                JSON.stringify(
                    conversation
                )
            );


            localStorage.setItem(
                "selectedUser",
                JSON.stringify(user)
            );


            /*
               Load DB messages.
            */

            const messageResponse =
                await getMessages(
                    conversation.id
                );


            const dbMessages =
                (
                    messageResponse?.messages ||
                    []
                ).map(formatMessage);


            setMessages(
                dbMessages
            );


            saveChatLocally(
                conversation.id,
                dbMessages
            );


            setMessagesLoaded(true);


        } catch (error) {

            console.error(
                "OPEN CHAT ERROR:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                error.message ||
                "Failed to open conversation"
            );

            setMessagesLoaded(true);
        }
    };


    /* =====================================================
       SEND MESSAGE
    ===================================================== */

    const handleSendMessage = async () => {

        const trimmed =
            message.trim();


        if (
            !trimmed &&
            !selectedFile
        ) {
            return;
        }


        if (!selectedConversation) {

            toast.error(
                "Please select a conversation"
            );

            return;
        }


        if (!currentUserId) {

            toast.error(
                "Authentication not found"
            );

            return;
        }


        if (!selectedUser?.id) {

            toast.error(
                "Receiver not found"
            );

            return;
        }


        try {

            let attachmentUrl =
                null;

            let messageType =
                "text";


            /* ============================
               UPLOAD FILE
            ============================ */

            if (selectedFile) {

                setIsUploading(true);


                const formData =
                    new FormData();

                formData.append(
                    "file",
                    selectedFile
                );


                const uploadResponse =
                    await fetch(
                        `${
                            import.meta.env
                                .VITE_API_URL ||
                            "http://localhost:8080"
                        }/api/user/upload`,
                        {
                            method: "POST",
                            headers: {
                                Authorization:
                                    `Bearer ${
                                        localStorage.getItem(
                                            "accessToken"
                                        )
                                    }`
                            },
                            body: formData
                        }
                    );


                const uploadData =
                    await uploadResponse.json();


                if (
                    !uploadResponse.ok ||
                    !uploadData.success
                ) {
                    throw new Error(
                        uploadData.message ||
                        "Upload failed"
                    );
                }


                attachmentUrl =
                    uploadData.url;


                if (
                    selectedFile.type
                        .startsWith("image/")
                ) {
                    messageType = "image";

                } else if (
                    selectedFile.type
                        .startsWith("video/")
                ) {
                    messageType = "video";

                } else if (
                    selectedFile.type
                        .startsWith("audio/")
                ) {
                    messageType = "audio";

                } else {
                    messageType = "file";
                }


                setIsUploading(false);
            }


            /* ============================
               SOCKET DATA
            ============================ */

            const messageData = {

                conversationId:
                    selectedConversation.id,

                senderId:
                    currentUserId,

                receiverId:
                    selectedUser.id,

                message:
                    trimmed,

                messageType,

                attachmentUrl
            };


            console.log(
                "SEND MESSAGE:",
                messageData
            );


            socket.emit(
                "send_message",
                messageData
            );


            /*
               Temporary UI message.
            */

            const temporaryMessage = {

                ...messageData,

                id:
                    `local-${Date.now()}`,

                createdAt:
                    new Date().toISOString()
            };


            setMessages((prev) => [
                ...prev,
                temporaryMessage
            ]);


            setMessage("");

            setSelectedFile(null);


        } catch (error) {

            setIsUploading(false);

            console.error(
                "SEND MESSAGE ERROR:",
                error
            );

            toast.error(
                error.message ||
                "Message failed"
            );
        }
    };


    /* =====================================================
       DELETE
    ===================================================== */

    const handleDeleteMessage = (
        msg
    ) => {

        if (
            !msg.id ||
            String(msg.id)
                .startsWith("local-")
        ) {
            toast.error(
                "Wait until message is saved"
            );
            return;
        }


        socket.emit(
            "delete_message",
            {
                messageId: msg.id,
                senderId: currentUserId
            }
        );


        setOpenMenuId(null);
    };


    /* =====================================================
       EDIT
    ===================================================== */

    const handleEditMessage = (
        msg
    ) => {

        if (
            msg.isDeleted ||
            msg.is_deleted
        ) {
            return;
        }


        if (
            String(msg.id)
                .startsWith("local-")
        ) {
            toast.error(
                "Wait until message is saved"
            );
            return;
        }


        setEditMessageId(
            msg.id
        );

        setEditMessage(
            msg.message || ""
        );

        setOpenMenuId(null);
    };


    const handleSaveEdit = () => {

        const trimmed =
            editMessage.trim();


        if (
            !trimmed ||
            !editMessageId
        ) {
            return;
        }


        socket.emit(
            "edit_message",
            {
                messageId:
                    editMessageId,

                senderId:
                    currentUserId,

                message:
                    trimmed
            }
        );
    };


    /* =====================================================
       SELECT FILE
    ===================================================== */

    const handleFileSelect = (
        e
    ) => {

        const file =
            e.target.files?.[0];

        if (!file) return;

        setSelectedFile(file);
    };


    /* =====================================================
       ENTER
    ===================================================== */

    const handleKeyDown = (
        e
    ) => {

        if (
            e.key === "Enter" &&
            !e.shiftKey
        ) {

            e.preventDefault();

            if (editMessageId) {
                handleSaveEdit();
            } else {
                handleSendMessage();
            }
        }
    };


    /* =====================================================
       LOADING
    ===================================================== */

    if (isLoading) {

        return (
            <div className="p-8">
                Loading Users...
            </div>
        );
    }


    /* =====================================================
       CHAT SCREEN
    ===================================================== */

    if (
        selectedUser &&
        selectedConversation
    ) {

        return (

            <div className="h-[calc(100vh-64px)] p-6">

                <div className="h-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border flex flex-col">

                    {/* HEADER */}

                    <div className="flex items-center justify-between px-6 py-4 border-b">

                        <div className="flex items-center gap-3">

                            <button
                                onClick={() => {

                                    setSelectedUser(null);

                                    setSelectedConversation(
                                        null
                                    );

                                    setIsSaved(false);

                                    setMessages([]);

                                    setMessage("");

                                    setSelectedFile(null);

                                    setMessagesLoaded(
                                        false
                                    );

                                    setOpenMenuId(
                                        null
                                    );

                                    setEditMessageId(
                                        ""
                                    );

                                    setEditMessage(
                                        ""
                                    );

                                    localStorage.removeItem(
                                        "selectedConversation"
                                    );

                                    localStorage.removeItem(
                                        "selectedUser"
                                    );
                                }}
                                className="text-gray-500 hover:text-gray-800 text-xl"
                            >
                                ←
                            </button>


                            <div>

                                <h2 className="font-semibold text-lg">
                                    {selectedUser.name}
                                </h2>

                                <p className="text-sm text-gray-500">
                                    {selectedUser.is_online
                                        ? "Online"
                                        : "Offline"}
                                </p>

                            </div>

                        </div>


                        <div className="flex items-center gap-4">

                            <button
                                onClick={handleToggleSave}
                                disabled={isSaving}
                                title={
                                    isSaved
                                        ? "Remove from saved"
                                        : "Save conversation"
                                }
                                className="
                                    p-2
                                    rounded-full
                                    hover:bg-gray-100
                                    transition
                                    disabled:opacity-50
                                "
                            >
                                <Star
                                    size={23}
                                    className={
                                        isSaved
                                            ? "fill-yellow-400 text-yellow-500"
                                            : "text-gray-400"
                                    }
                                />
                            </button>

                            <div
                                className={`w-3 h-3 rounded-full ${
                                    selectedUser.is_online
                                        ? "bg-green-500"
                                        : "bg-gray-400"
                                }`}
                            />

                        </div>

                    </div>


                    {/* MESSAGES */}

                    <div className="flex-1 p-6 overflow-y-auto bg-gray-50">

                        {messages.length === 0 ? (

                            <div className="flex justify-center">

                                <p className="text-sm text-gray-400">
                                    No messages yet
                                </p>

                            </div>

                        ) : (

                            <div className="flex flex-col gap-3">

                                {messages.map(
                                    (msg, index) => {

                                        const isMine =
                                            String(
                                                msg.senderId
                                            ) ===
                                            String(
                                                currentUserId
                                            );


                                        const deleted =
                                            msg.isDeleted ||
                                            msg.is_deleted;


                                        return (

                                            <div
                                                key={
                                                    msg.id ||
                                                    index
                                                }
                                                className={`flex ${
                                                    isMine
                                                        ? "justify-end"
                                                        : "justify-start"
                                                }`}
                                            >

                                                <div
                                                    className={`relative max-w-[70%] px-4 py-3 rounded-2xl ${
                                                        isMine
                                                            ? "bg-indigo-500 text-white rounded-br-md"
                                                            : "bg-white text-gray-800 border rounded-bl-md"
                                                    }`}
                                                >

                                                    {/* IMAGE */}

                                                    {msg.messageType ===
                                                        "image" &&
                                                        msg.attachmentUrl && (

                                                            <img
                                                                src={
                                                                    msg.attachmentUrl
                                                                }
                                                                alt="attachment"
                                                                className="max-w-xs rounded-lg mb-2"
                                                            />

                                                        )}


                                                    {/* VIDEO */}

                                                    {msg.messageType ===
                                                        "video" &&
                                                        msg.attachmentUrl && (

                                                            <video
                                                                src={
                                                                    msg.attachmentUrl
                                                                }
                                                                controls
                                                                className="max-w-xs rounded-lg mb-2"
                                                            />

                                                        )}


                                                    {/* AUDIO */}

                                                    {msg.messageType ===
                                                        "audio" &&
                                                        msg.attachmentUrl && (

                                                            <audio
                                                                src={
                                                                    msg.attachmentUrl
                                                                }
                                                                controls
                                                                className="mb-2"
                                                            />

                                                        )}


                                                    {/* FILE */}

                                                    {msg.messageType ===
                                                        "file" &&
                                                        msg.attachmentUrl && (

                                                            <a
                                                                href={
                                                                    msg.attachmentUrl
                                                                }
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="underline block mb-2"
                                                            >
                                                                📄 Open File
                                                            </a>

                                                        )}


                                                    {/* TEXT */}

                                                    {deleted ? (

                                                        <p className="italic opacity-70">
                                                            This message was deleted
                                                        </p>

                                                    ) : (

                                                        <p>
                                                            {
                                                                msg.message
                                                            }

                                                            {(
                                                                msg.isEdited ||
                                                                msg.is_edited
                                                            ) && (
                                                                <span className="text-[10px] opacity-70 ml-2">
                                                                    edited
                                                                </span>
                                                            )}
                                                        </p>

                                                    )}


                                                    {/* MENU */}

                                                    {isMine &&
                                                        !deleted &&
                                                        !String(
                                                            msg.id
                                                        ).startsWith(
                                                            "local-"
                                                        ) && (

                                                            <div className="absolute top-1 right-1">

                                                                <button
                                                                    onClick={() =>
                                                                        setOpenMenuId(
                                                                            openMenuId ===
                                                                                msg.id
                                                                                ? null
                                                                                : msg.id
                                                                        )
                                                                    }
                                                                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-black/10"
                                                                >
                                                                    ⋮
                                                                </button>


                                                                {openMenuId ===
                                                                    msg.id && (

                                                                    <div className="absolute right-0 top-7 z-50 w-24 bg-white text-gray-800 border rounded-lg shadow-lg overflow-hidden">

                                                                        <button
                                                                            onClick={() =>
                                                                                handleEditMessage(
                                                                                    msg
                                                                                )
                                                                            }
                                                                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                                                                        >
                                                                            Edit
                                                                        </button>


                                                                        <button
                                                                            onClick={() =>
                                                                                handleDeleteMessage(
                                                                                    msg
                                                                                )
                                                                            }
                                                                            className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-gray-100"
                                                                        >
                                                                            Delete
                                                                        </button>

                                                                    </div>

                                                                )}

                                                            </div>

                                                        )}

                                                </div>

                                            </div>

                                        );
                                    }
                                )}

                            </div>

                        )}

                    </div>


                    {/* INPUT */}

                    <div className="border-t p-4">

                        {selectedFile && (

                            <div className="flex items-center gap-2 mb-3 px-2">

                                <span className="text-sm text-gray-600">
                                    📎 {selectedFile.name}
                                </span>

                                <button
                                    onClick={() =>
                                        setSelectedFile(
                                            null
                                        )
                                    }
                                    className="text-red-500"
                                >
                                    X
                                </button>

                            </div>

                        )}


                        <div className="flex items-center gap-3">

                            {!editMessageId && (

                                <label className="cursor-pointer text-xl">

                                    📎

                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                                        onChange={
                                            handleFileSelect
                                        }
                                    />

                                </label>

                            )}


                            <input
                                type="text"
                                value={
                                    editMessageId
                                        ? editMessage
                                        : message
                                }
                                onChange={(e) =>
                                    editMessageId
                                        ? setEditMessage(
                                              e.target.value
                                          )
                                        : setMessage(
                                              e.target.value
                                          )
                                }
                                onKeyDown={
                                    handleKeyDown
                                }
                                placeholder={
                                    editMessageId
                                        ? "Edit message..."
                                        : "Type a message..."
                                }
                                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400"
                            />


                            {editMessageId ? (

                                <>

                                    <button
                                        onClick={() => {

                                            setEditMessageId(
                                                ""
                                            );

                                            setEditMessage(
                                                ""
                                            );
                                        }}
                                        className="px-4 py-3 rounded-xl border hover:bg-gray-100"
                                    >
                                        Cancel
                                    </button>


                                    <button
                                        onClick={
                                            handleSaveEdit
                                        }
                                        disabled={
                                            !editMessage.trim()
                                        }
                                        className="px-5 py-3 rounded-xl bg-indigo-500 text-white disabled:opacity-50"
                                    >
                                        Save
                                    </button>

                                </>

                            ) : (

                                <button
                                    onClick={
                                        handleSendMessage
                                    }
                                    disabled={
                                        !message.trim() &&
                                        !selectedFile
                                    }
                                    className="px-5 py-3 rounded-xl bg-indigo-500 text-white disabled:opacity-50"
                                >
                                    {isUploading
                                        ? "Uploading..."
                                        : "Send"}
                                </button>

                            )}

                        </div>

                    </div>

                </div>

            </div>
        );
    }


    /* =====================================================
       USER LIST
    ===================================================== */

    return (

        <div className="p-8">

            <h1 className="text-3xl font-semibold">
                Live Conversation
            </h1>

            <p className="mt-2 text-gray-500">
                Select a user to start a conversation
            </p>


            <div className="mt-8 max-w-xl">

                {users.length === 0 ? (

                    <div className="bg-white p-5 rounded-xl shadow">
                        No other users found
                    </div>

                ) : (

                    users.map((user) => (

                        <div
                            key={user.id}
                            onClick={() =>
                                handleClickUser(
                                    user
                                )
                            }
                            className="flex items-center justify-between p-4 mb-3 bg-white rounded-xl shadow-sm border cursor-pointer hover:bg-gray-50"
                        >

                            <div>

                                <h2 className="font-semibold text-gray-800">
                                    {user.name}
                                </h2>

                                <p className="text-sm text-gray-500">
                                    {user.email}
                                </p>

                            </div>


                            <div className="flex items-center gap-2">

                                <span
                                    className={`w-3 h-3 rounded-full ${
                                        user.is_online
                                            ? "bg-green-500"
                                            : "bg-gray-400"
                                    }`}
                                />

                                <span className="text-sm text-gray-600">
                                    {user.is_online
                                        ? "Online"
                                        : "Offline"}
                                </span>

                            </div>

                        </div>

                    ))

                )}

            </div>

        </div>
    );
};


export default LiveConversation;